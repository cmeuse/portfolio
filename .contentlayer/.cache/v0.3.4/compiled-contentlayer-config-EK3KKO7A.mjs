// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Destination = defineDocumentType(() => ({
  name: "Destination",
  filePathPattern: `destinations/**/*.mdx`,
  contentType: "mdx",
  fields: {
    slug: {
      type: "string",
      required: true
    },
    city: {
      type: "string",
      required: true
    },
    country: {
      type: "string",
      required: true
    },
    headline: {
      type: "string",
      required: true
    },
    role: {
      type: "string",
      required: true
    },
    timeframe: {
      type: "string",
      required: true
    },
    soundtrackPlaylistId: {
      type: "string",
      required: false
    },
    coordinates: {
      type: "json",
      required: true
    },
    metrics: {
      type: "json",
      required: false
    },
    stack: {
      type: "list",
      of: { type: "string" },
      required: false
    },
    overview: {
      type: "string",
      required: true
    },
    buildNotes: {
      type: "list",
      of: { type: "string" },
      required: false
    },
    artifacts: {
      type: "json",
      required: false
    },
    links: {
      type: "json",
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (destination) => `/destinations/${destination.slug}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Destination]
});
export {
  Destination,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-EK3KKO7A.mjs.map
