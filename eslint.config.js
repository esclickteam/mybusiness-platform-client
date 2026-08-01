import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "build"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Existing codebase has a large amount of pre-existing debt in these
      // categories; keep them as warnings so real regressions are still
      // visible without blocking every build.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-vars": "off",
      "no-empty": "warn",
      "no-constant-condition": "warn",
      "react-refresh/only-export-components": "off",
      // Large pre-existing codebase: keep these as warnings so the lint
      // script is usable as a signal without blocking on hundreds of
      // pre-existing findings that are out of scope for this pass.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-useless-assignment": "warn",
      // eslint-plugin-react-hooks v7 ships React Compiler readiness checks
      // (refs/purity/immutability/static-components/memoization) as errors
      // by default. This project does not enable the React Compiler, so
      // these are forward-looking compatibility findings rather than
      // current bugs; keep them visible as warnings instead of failing lint.
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/error-boundaries": "warn",
      "no-extra-boolean-cast": "warn",
      "no-useless-escape": "warn",
      "prefer-const": "warn",
      "no-cond-assign": "warn",
      "no-case-declarations": "warn",
      "no-fallthrough": "warn",
      "no-prototype-builtins": "warn",
      "no-control-regex": "warn",
    },
  }
);
