export default () => ({
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "controller.index",
      config: { policies: [] },
    },
    {
      method: "GET",

      path: "/repo",

      handler: "repo.index",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::isAuthenticatedAdmin",
            config: {
              action: ["plugins::github-project.repose.read"],
            },
          },
        ],
      },
    },
    {
      method: "POST",
      path: "/project",
      handler: "projectController.create",
      config: { policies: ["admin::isAuthenticatedAdmin"] },
    },
    {
      method: "DELETE",
      path: "/project/:id",
      handler: "projectController.delete",
      config: { policies: ["admin::isAuthenticatedAdmin"] },
    },
    {
      method: "GET",
      path: "/projects",
      handler: "projectController.find",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/projects/:id",
      handler: "projectController.findOne",
      config: { auth: false },
    },
  ],
});
