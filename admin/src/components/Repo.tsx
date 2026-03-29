import {
  Alert,
  Box,
  Checkbox,
  Flex,
  IconButton,
  Link,
  Loader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from "@strapi/design-system";

import { Pencil, Plus, Trash } from "@strapi/icons";
import { useFetchClient } from "@strapi/strapi/admin";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { BulkActions } from "./BulkActions";
import ConfirmationDialog from "./ConfirmationDialog";

type RepoItem = {
  id: number;
  name: string;
  shortDescription: string | null;
  url: string;
  projectId?: number | null;
  projectDocumentId?: string | null;
};
const COL_COUNT = 10;

export default function Repo() {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectRepos] = useState<number[]>([]);
  const [alert, setAlert] = useState<
    { title: string; message: string; variant: "success" | "danger" } | undefined
  >(undefined);
  const [deleteProjectDialog, setDeleteProjectDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const showAlert = useCallback(
    (alertData: { title: string; message: string; variant: "success" | "danger" }) => {
      setAlert(alertData);
      setTimeout(() => setAlert(undefined), 1500);
    },
    []
  );

  const allChecked = repos.length > 0 && selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && selectedRepos.length < repos.length;

  const { get, post, del: deleteRequest } = useFetchClient();
  const { pathname } = useLocation();
  const basePath = pathname.split("/plugins/")[0] || "/dashboard";

  useEffect(() => {
    setLoading(true);
    get("/github-project/repo")
      .then(({ data }) => setRepos(data.data ?? []))
      .catch((err) =>
        showAlert({
          title: "Error",
          message: err.toString(),
          variant: "danger",
        })
      )
      .finally(() => setLoading(false));
  }, [get, showAlert]);

  const createProjects = async (reposToCreate: RepoItem[]) => {
    try {
      await post("/github-project/projects", reposToCreate);
      const { data } = await get("/github-project/repo");
      setRepos(Array.isArray(data?.data) ? data.data : []);
      setSelectRepos([]);
      showAlert({
        title: "Projects created",
        message: `Successfully created ${reposToCreate.length} project(s)`,
        variant: "success",
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      showAlert({
        title: "Project creation failed",
        message: `Failed to create projects: ${reposToCreate.map((r) => r.name).join(", ")}`,
        variant: "danger",
      });
      console.error("createProjects error:", e?.response?.data ?? err);
    }
  };
  const deleteAllProjects = async (reposToDelete: RepoItem[]) => {
    try {
      const reposWithProject = reposToDelete.filter((r) => r.projectId != null);
      await Promise.all(
        reposWithProject.map((r) => deleteRequest(`/github-project/project/${r.projectId}`))
      );
      const { data } = await get("/github-project/repo");
      setRepos(Array.isArray(data?.data) ? data.data : []);
      setSelectRepos([]);
      showAlert({
        title: "Projects deleted",
        message: `Successfully deleted ${reposWithProject.length} project(s)`,
        variant: "success",
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      showAlert({
        title: "Project deletion failed",
        message: `Failed to delete projects: ${reposToDelete.map((r) => r.name).join(", ")}`,
        variant: "danger",
      });
      console.error("deleteProjects error:", e?.response?.data ?? err);
    } finally {
      setSelectRepos([]);
    }
  };

  const createProject = async (repo: RepoItem) => {
    try {
      const { data } = await post("/github-project/project", repo);
      if (data?.data) {
        const { data: repoData } = await get("/github-project/repo");
        setRepos(Array.isArray(repoData?.data) ? repoData.data : []);
        showAlert({
          title: "Project created",
          message: `Successfully created project ${data.data.name ?? repo.name}`,
          variant: "success",
        });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      showAlert({
        title: "Project creation failed",
        message: `Failed to create project ${repo.name}`,
        variant: "danger",
      });
      console.error("createProject error:", e?.response?.data ?? err);
    }
  };
  const deleteProject = async (projectId: string | number) => {
    try {
      await deleteRequest(`/github-project/project/${projectId}`);
      const { data } = await get("/github-project/repo");
      setRepos(Array.isArray(data?.data) ? data.data : []);
      showAlert({
        title: "Project deleted",
        message: "Successfully deleted project",
        variant: "success",
      });
    } catch (err) {
      showAlert({
        title: "Error",
        message: (err as Error).toString(),
        variant: "danger",
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <Box padding={8} background="neutral100">
      {deleteProjectDialog && (
        <ConfirmationDialog
          open={true}
          title={deleteProjectDialog.title}
          message={deleteProjectDialog.message}
          onConfirm={deleteProjectDialog.onConfirm}
          onCancel={deleteProjectDialog.onCancel}
        />
      )}
      {alert && (
        <div style={{ position: "absolute", top: 2, left: "14%", zIndex: 1000 }}>
          <Alert closeLabel="Close alert" title={alert.title} variant={alert.variant}>
            {alert.message}
          </Alert>
        </div>
      )}
      {selectedRepos.length > 0 && (
        <BulkActions
          selectedRepos={(Array.isArray(repos) ? repos : []).filter((r) =>
            selectedRepos.includes(r.id)
          )}
          bulkCreateProjects={createProjects}
          onRequestBulkDelete={(reposToDelete) =>
            setDeleteProjectDialog({
              title: "Delete projects",
              message: "Are you sure you want to delete these projects?",
              onConfirm: () => {
                deleteAllProjects(reposToDelete);
                setDeleteProjectDialog(null);
              },
              onCancel: () => setDeleteProjectDialog(null),
            })
          }
        />
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                aria-label="Select all entries"
                checked={isIndeterminate ? "indeterminate" : allChecked}
                onCheckedChange={(value: boolean) => {
                  if (value) {
                    setSelectRepos(repos.map((repo) => repo.id));
                  } else {
                    setSelectRepos([]);
                  }
                }}
              />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {(Array.isArray(repos) ? repos : []).map((repo) => {
            const { id, name, shortDescription, url, projectId, projectDocumentId } = repo;

            return (
              <Tr key={id}>
                <Td>
                  <Checkbox
                    aria-label={`Select ${id}`}
                    checked={selectedRepos.includes(id)}
                    onCheckedChange={(value: boolean) => {
                      const newSelectedRepos = value
                        ? [...selectedRepos, id]
                        : selectedRepos.filter((item) => item !== id);
                      setSelectRepos(newSelectedRepos);
                    }}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {shortDescription && shortDescription.length > 100
                      ? `${shortDescription.slice(0, 10)}...`
                      : shortDescription}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>
                      Link
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  {projectId ? (
                    <Flex gap={1} alignItems="center">
                      {projectDocumentId ? (
                        <Link
                          href={`${basePath}/content-manager/collection-types/plugin::github-project.project/${projectDocumentId}`}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              cursor: "pointer",
                            }}
                          >
                            <Pencil />
                          </span>
                        </Link>
                      ) : null}
                      <Box>
                        <IconButton
                          onClick={() =>
                            projectId &&
                            setDeleteProjectDialog({
                              title: "Delete project",
                              message: "Are you sure you want to delete this project?",
                              onConfirm: () => {
                                deleteProject(projectId);
                                setDeleteProjectDialog(null);
                              },
                              onCancel: () => setDeleteProjectDialog(null),
                            })
                          }
                          label="Delete project"
                          borderWidth={0}
                        >
                          <Trash />
                        </IconButton>
                      </Box>
                    </Flex>
                  ) : (
                    <IconButton
                      onClick={() => createProject(repo)}
                      label="Add project"
                      borderWidth={0}
                    >
                      <Plus />
                    </IconButton>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
