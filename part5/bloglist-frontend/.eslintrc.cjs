module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vitest-globals/env": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "airbnb",
    "plugin:prettier/recommended",
    "plugin:vitest-globals/recommended",
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "import", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-console": "warn",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
