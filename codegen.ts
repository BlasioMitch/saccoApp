
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: "src/graphql/**/*.ts",
  generates: {
    "src/graphql/types/": {
      preset: "client",
      plugins: [],
      config: {
        // Whole shillings, 64-bit backed on the server; exact as JS numbers up to MAX_SAFE_INTEGER
        scalars: { Money: "number" }
      }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
