export default {
  kind: "collectionType",
  collectionName: "projects",
  info: {
    singularName: "project",
    pluralName: "projects",
    displayName: "Project",
    description: "GitHub project / repository",
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    repositoryId: {
      type: "biginteger",
      required: true,
      description: "GitHub repository id",
      unique: true,
    },
    name: {
      type: "string",
      required: true,
    },
    shortDescription: {
      type: "text",
    },
    url: {
      type: "string",
      required: true,
    },
    default_branch: {
      type: "string",
    },
    longDescription: {
      type: "text",
    },
    ownerLogin: {
      type: "string",
    },

    coverImage: {
      type: "media",
      allowedTypes: ["images"],
      multiple: false,
      required: false,
    },
    urlVideos: {
      type: "component",
      component: "plugin::github-project.project.video-url",
      repeatable: true,
      required: false,
      description: "Tablica linków do filmów",
    },
    gallery: {
      type: "media",
      allowedTypes: ["images"],
      multiple: true,
      required: false,
      description: "Galeria zdjęć (karuzela)",
    },
    customSettings: {
      type: "json",
      required: false,
      description: "Dodatkowe ustawienia projektu (dowolne klucze i wartości w formacie JSON)",
    },
  },
};
