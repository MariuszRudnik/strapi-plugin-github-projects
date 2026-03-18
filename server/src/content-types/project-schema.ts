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
  pluginOptions: {
    i18n: {
      localized: true,
    },
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
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    shortDescription: {
      type: "text",
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    url: {
      type: "string",
      required: true,
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    default_branch: {
      type: "string",
    },
    longDescription: {
      type: "text",
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    ownerLogin: {
      type: "string",
      pluginOptions: {
        i18n: { localized: true },
      },
    },

    coverImage: {
      type: "media",
      allowedTypes: ["images"],
      multiple: false,
      required: false,
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    gallery: {
      type: "media",
      allowedTypes: ["images"],
      multiple: true,
      required: false,
      description: "Galeria zdjęć (karuzela)",
      pluginOptions: {
        i18n: { localized: true },
      },
    },
    customSettings: {
      type: "json",
      required: false,
      description: "Dodatkowe ustawienia projektu (dowolne klucze i wartości w formacie JSON)",
      pluginOptions: {
        i18n: { localized: true },
      },
    },
  },
};
