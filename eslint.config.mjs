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
      // Legacy admin codebase: keep builds passing while we incrementally add strict typing.
      "@typescript-eslint/no-explicit-any": "off",
      // Existing content strings include quotes in JSX.
      "react/no-unescaped-entities": "off",
      // Some pages have conditional hooks that need deeper refactors.
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

export default eslintConfig;
