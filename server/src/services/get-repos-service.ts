import { request } from "@octokit/request";
import type { Core } from "@strapi/strapi";
import axios from "axios";
import md from "markdown-it";

const README_BASE = "https://raw.githubusercontent.com";

type ProjectLinkMeta =
  | { projectId: number; projectDocumentId: string }
  | { projectId: number; projectDocumentId: null };

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getProjectForRepo: async (repo: { id: number }): Promise<ProjectLinkMeta | null> => {
    const { id } = repo;

    const doc = await strapi.documents("plugin::github-project.project").findFirst({
      filters: { repositoryId: id },
    });
    if (doc?.id != null && doc.documentId != null) {
      return {
        projectId: Number(doc.id),
        projectDocumentId: String(doc.documentId),
      };
    }

    const matchingProject = await strapi.entityService.findMany("plugin::github-project.project", {
      filters: {
        repositoryId: id,
      },
      limit: 1,
    });
    if (matchingProject.length !== 1) return null;
    const row = matchingProject[0] as { id: number; documentId?: string };
    return {
      projectId: row.id,
      projectDocumentId: row.documentId != null ? String(row.documentId) : null,
    };
  },

  async getRepos(): Promise<unknown> {
    const username = process.env.GITHUB_USER;
    const token = process.env.GITHUB_TOKEN;

    if (!username) {
      return {
        message:
          "Brak konfiguracji GITHUB_USER w środowisku backendu. Ustaw nazwę użytkownika GitHub.",
      };
    }

    try {
      const result = await request("GET /users/{username}/repos", {
        username,
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      const mapped = await Promise.all(
        result.data.map(async (item) => {
          const { id, name, description, html_url, owner, default_branch } = item;
          const branch = default_branch ?? "main";
          const readmeUrl = `${README_BASE}/${owner.login}/${name}/${branch}/README.md`;

          const res = await axios.get(readmeUrl).catch(() => null);

          const longDescription =
            res && res.status === 200 && typeof res.data === "string"
              ? md().render(res.data).replaceAll("\n", "<br>")
              : null;

          const projectMeta = await strapi
            .plugin("github-project")
            .service("getReposService")
            .getProjectForRepo({ id });

          return {
            id,
            name,
            shortDescription: description ?? null,
            url: html_url,
            default_branch: branch,
            longDescription,
            projectId: projectMeta?.projectId ?? null,
            projectDocumentId: projectMeta?.projectDocumentId ?? null,
          };
        })
      );

      return mapped;
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err?.status ?? 500;
      const message = err?.message ?? "Nie udało się pobrać publicznych repozytoriów z GitHuba.";

      strapi.log.error(`GitHub API error (${status}): ${message}`);

      return {
        message,
        status,
      };
    }
  },

  // deleteRepos: async (repos) => {
  //   return Promise.all(
  //     repos.map(
  //       async (repo) =>
  //         await strapi.plugin("github-project").service("getReposService").deleteRepo(repo.id)
  //     )
  //   );
  // },
  // deleteRepo: async (id) => {
  //   return strapi.entityService.delete("plugin::github-project.project", id);
  // },
});
