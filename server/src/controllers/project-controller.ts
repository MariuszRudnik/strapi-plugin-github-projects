import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  create: async (ctx) => {
    try {
      const repo = ctx.request.body?.data ?? ctx.request.body;
      if (!repo?.id || !repo?.name || !repo?.url) {
        return ctx.badRequest("Missing required fields: id, name, url");
      }
      const userId = ctx.state.user?.id ?? null;
      const newProject = await strapi
        .plugin("github-project")
        .service("projectService")
        .create(repo, userId);
      ctx.body = { data: newProject };
    } catch (err) {
      strapi.log.error("projectController.create:", err);
      ctx.internalServerError("Failed to create project");
    }
  },
  delete: async (ctx) => {
    try {
      const { id } = ctx.params;
      await strapi.plugin("github-project").service("projectService").delete(id);
      ctx.body = { data: { message: "Project deleted" } };
    } catch (err) {
      strapi.log.error("projectController.delete:", err);
      ctx.internalServerError("Failed to delete project");
    }
  },
  createAll: async (ctx) => {
    try {
      const repos = ctx.request.body?.data ?? ctx.request.body;
      await strapi
        .plugin("github-project")
        .service("projectService")
        .createAll(repos, ctx.state.user?.id ?? null);
      ctx.body = { data: { message: "Projects created" } };
    } catch (err) {
      strapi.log.error("projectController.createAll:", err);
      ctx.internalServerError("Failed to create projects");
    }
  },
  deleteAll: async (ctx) => {
    try {
      const repos = ctx.request.body?.data ?? ctx.request.body;
      await strapi.plugin("github-project").service("projectService").deleteAll(repos);
      ctx.body = { data: { message: "Projects deleted" } };
    } catch (err) {
      strapi.log.error("projectController.deleteAll:", err);
      ctx.internalServerError("Failed to delete projects");
    }
  },
  find: async (ctx) => {
    const projects = await strapi
      .plugin("github-project")
      .service("projectService")
      .find(ctx.query);
    ctx.body = { data: projects };
  },
  findOne: async (ctx) => {
    const { id } = ctx.params;
    const project = await strapi
      .plugin("github-project")
      .service("projectService")
      .findOne(id, ctx.query);
    ctx.body = { data: project };
  },
});
