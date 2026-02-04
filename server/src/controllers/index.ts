import controller from "./controller";
import projectController from "./project-controller";
import repo from "./repo";

const controllers: Record<string, unknown> = {
  controller,
  repo,
  projectController,
};

export default controllers;
