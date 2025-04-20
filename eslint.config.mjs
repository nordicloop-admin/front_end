import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused variables when they start with an underscore
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],

      // Downgrade unescaped entities from error to warning
      "react/no-unescaped-entities": "warn",

      // Disable prop-types as we're using TypeScript
      "react/prop-types": "off",

      // Allow jsx syntax in .tsx files
      "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],

      // Prevent missing displayName in a React component definition
      "react/display-name": "off",

      // Disable some accessibility rules that might be too strict for your project
      "jsx-a11y/anchor-is-valid": "warn",

      // Allow console logs in development but error in production
      "no-console": "error",

      // Disable explicit any errors for now
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
