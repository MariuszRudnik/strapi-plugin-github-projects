import type { Core } from "@strapi/strapi";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "GitHub Project",
    uid: "use",
    pluginName: "github-project",
  },
  {
    section: "plugins",
    subCategory: "Repositories",
    displayName: "GitHub Project Read",
    uid: "repose.read",
    pluginName: "github-project",
  },
];

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  await strapi.admin.services.permission.actionProvider.registerMany(RBAC_ACTIONS);
};

export default bootstrap;
