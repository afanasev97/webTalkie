module.exports = {
	extends: "standard",
	rules: {
		quotes: ["error", "double"],
		semi: ["error", "always"],
		indent: ["error", "tab", { SwitchCase: 1 }],
		"no-tabs": 0,
		"space-before-function-paren": ["error", {
			anonymous: "always",
			named: "never",
			asyncArrow: "always"
		}],
		"no-throw-literal": 0,
		"new-cap": 0,
		"no-class-assign": 0
	}
};
