import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import officeAddins from "eslint-plugin-office-addins";
import parser from "@typescript-eslint/parser";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "office-addins": officeAddins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...officeAddins.configs.react.rules,
    },
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        Office: "readonly",
        OfficeRuntime: "readonly",
        localStorage: "readonly",
        console: "readonly",
        Excel: "readonly",
      },
    },
  },
]);
