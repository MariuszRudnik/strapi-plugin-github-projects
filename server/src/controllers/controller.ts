import type { Core } from "@strapi/strapi";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index: async (ctx) => {
    ctx.body = strapi
      .plugin("github-project")
      // the name of the service file & the method.
      .service("service")

      .getWelcomeMessage();
  },
});

export default controller;
