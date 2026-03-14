import { request } from "@octokit/request";
import type { Core } from "@strapi/strapi";
import axios from "axios";
import md from "markdown-it";

const README_BASE = "https://raw.githubusercontent.com";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getProjectForRepo: async (repo: { id: number }) => {
    const { id } = repo;
    const matching = await strapi.entityService.findMany("plugin::github-project.project", {
      filters: { repositoryId: id },
    });
    if (matching.length !== 1) return null;
    const entity = matching[0];
    const documentId = entity.documentId ?? entity.document_id ?? null;
    if (documentId) return { documentId, id: entity.id };
    try {
      const [row] = await strapi.db
        .connection("projects")
        .where("repository_id", id)
        .select("id", "document_id")
        .limit(1);
      return row?.document_id
        ? { documentId: row.document_id, id: row.id }
        : { documentId: null, id: entity.id };
    } catch {
      return { documentId: null, id: entity.id };
    }
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

          const project = await strapi
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
            projectId: project?.id ?? null,
            projectDocumentId: project?.documentId ?? null,
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
