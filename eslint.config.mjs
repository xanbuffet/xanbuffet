import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
	{
		files: ["**/*.ts", "**/*.tsx", "*.vue", "**/*.vue"],
		rules: {
			"no-console": "off",
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
			"indent": ["error", "tab"],
			"comma-dangle": ["error", "always-multiline"],
			"vue/multi-word-component-names": "off",
		},
	},
);
