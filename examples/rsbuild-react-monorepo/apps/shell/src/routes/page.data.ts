export const loader = function rootLayoutLoader() {
	console.log("home page.data called");

	return {
		code: 0,
		data: {
			name: "@app/shell from page.data",
		},
	};
};