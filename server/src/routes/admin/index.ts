export default () => ({
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/repo",
      handler: "repo.index",
      config: { policies: [] },
    },
    {
      method: "POST",
      path: "/project",
      handler: "projectController.create",
      config: { policies: [] },
    },
    {
      method: "DELETE",
      path: "/project/:id",
      handler: "projectController.delete",
      config: { policies: [] },
    },
    {
      method: "POST",
      path: "/projects",
      handler: "projectController.createAll",
      config: { policies: [] },
    },
    {
      method: "DELETE",
      path: "/projects",
      handler: "projectController.deleteAll",
      config: { policies: [] },
    },
  ],
});
