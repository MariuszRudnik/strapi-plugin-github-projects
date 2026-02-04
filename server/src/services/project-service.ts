export default ({ strapi }) => ({
  create: async (repo, _userId) => {
    const existing = await strapi.entityService.findMany("plugin::github-project.project", {
      filters: { repositoryId: repo.id },
    });
    if (existing.length > 0) {
      return existing[0];
    }
    return strapi.entityService.create("plugin::github-project.project", {
      data: {
        repositoryId: repo.id,
        name: repo.name,
        shortDescription: repo.shortDescription ?? null,
        url: repo.url,
        longDescription: repo.longDescription ?? null,
        default_branch: repo.default_branch ?? "main",
      },
    });
  },
  delete: async (id) => {
    const docId = Number(id);
    return strapi.entityService.delete("plugin::github-project.project", docId);
  },
  createAll: async (repos, userId) => {
    return Promise.all(
      repos.map(
        async (repo) =>
          await strapi.plugin("github-project").service("projectService").create(repo, userId)
      )
    );
  },
  deleteAll: async (repos) => {
    const reposWithProjectId = repos.filter((repo) => repo.projectId != null);
    return Promise.all(
      reposWithProjectId.map(
        async (repo) =>
          await strapi.plugin("github-project").service("projectService").delete(repo.projectId)
      )
    );
  },
  find: async (query) => {
    return strapi.entityService.findMany("plugin::github-project.project", query);
  },
  findOne: async (id, query) => {
    return strapi.entityService.findOne("plugin::github-project.project", id, query);
  },
});
