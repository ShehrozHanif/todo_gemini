import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier/recommended"; // Using the recommended config
import configPrettier from "eslint-config-prettier"; // The configuration to turn off conflicting rules

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Add Prettier as the last configuration to ensure it overrides conflicting rules
  prettier, // Runs Prettier as an ESLint rule
  configPrettier, // Turns off conflicting ESLint rules
]);

export default eslintConfig;

