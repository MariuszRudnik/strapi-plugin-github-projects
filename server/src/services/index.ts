import getReposService from "./get-repos-service";
import projectService from "./project-service";
import service from "./service";

const services: Record<string, unknown> = {
  service,
  getReposService,
  projectService,
};

export default services;
