async function getEnabledLocales(strapi) {
  try {
    const localesService = strapi.plugin("i18n").service("locales");
    const locales = (await localesService.findMany?.()) ?? (await localesService.find?.());
    return Array.isArray(locales) ? locales.map((l) => l.code) : ["en"];
  } catch {
    return ["en"];
  }
}

export default ({ strapi }) => ({
  create: async (repo, _userId) => {
    const existing = await strapi.entityService.findMany("plugin::github-project.project", {
      filters: { repositoryId: repo.id },
    });
    if (existing.length > 0) {
      return existing[0];
    }

    const locales = await getEnabledLocales(strapi);
    const projectData = {
      repositoryId: repo.id,
      name: repo.name,
      shortDescription: repo.shortDescription ?? null,
      url: repo.url,
      longDescription: repo.longDescription ?? null,
      default_branch: repo.default_branch ?? "main",
      ownerLogin: repo.ownerLogin ?? repo.owner?.login ?? null,
    };

    const docs = strapi.documents("plugin::github-project.project");
    const first = await docs.create({
      locale: locales[0],
      data: projectData,
    });

    for (let i = 1; i < locales.length; i++) {
      await docs.create({
        documentId: first.documentId,
        locale: locales[i],
        data: projectData,
      });
    }

    return first;
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
