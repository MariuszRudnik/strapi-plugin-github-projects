import projectSchema from "./project-schema";

const contentTypes: Record<string, unknown> = {
  project: { schema: projectSchema },
};

export default contentTypes;
