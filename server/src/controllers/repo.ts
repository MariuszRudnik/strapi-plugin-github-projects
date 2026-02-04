import type { Core } from "@strapi/strapi";

const repo = ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx) {
    const data = await strapi.plugin("github-project").service("getReposService").getRepos();

    ctx.body = { message: "GET /repo", data };
  },
});

export default repo;
