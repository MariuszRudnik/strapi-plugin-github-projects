import { Box } from "@strapi/design-system";
import { Typography } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";

type RepoItem = {
  id: number;
  name: string;
  shortDescription: string | null;
  url: string;
  projectId?: number | null;
};

type BulkActionsProps = {
  selectedRepos: RepoItem[];
  bulkCreateProjects: (repos: RepoItem[]) => Promise<void>;
  onRequestBulkDelete: (repos: RepoItem[]) => void;
};

export const BulkActions = ({
  selectedRepos,
  bulkCreateProjects,
  onRequestBulkDelete,
}: BulkActionsProps) => {
  const reposWithProject = selectedRepos.filter((repo) => !repo.projectId);
  const reposWithoutProject = selectedRepos.filter((repo) => repo.projectId);
  const projectsToBeCreated = reposWithProject.length;
  const projectsToBeDeleted = reposWithoutProject.length;
  return (
    <Box paddingBottom={8}>
      <Flex gap={2}>
        <Typography variant="sigma">
          {`You have selected ${projectsToBeCreated} projects to generate and ${projectsToBeDeleted} to delete`}
        </Typography>
        {projectsToBeCreated > 0 && (
          <Button
            size="S"
            variant="success-light"
            style={{ minHeight: 40 }}
            onClick={() => bulkCreateProjects(reposWithProject)}
          >
            {`Create ${projectsToBeCreated} projects`}
          </Button>
        )}
        {projectsToBeDeleted > 0 && (
          <Button
            size="S"
            variant="danger-light"
            style={{ minHeight: 40 }}
            onClick={() => onRequestBulkDelete(reposWithoutProject)}
          >
            {`Delete ${projectsToBeDeleted} projects`}
          </Button>
        )}
      </Flex>
    </Box>
  );
};
