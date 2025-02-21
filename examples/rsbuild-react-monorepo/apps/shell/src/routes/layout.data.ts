export const loader = function layoutLoader() {
	console.log("home layout.data called");

	return {
		code: 0,
		data: {
			name: "@app/shell from layout.data",
		},
	};
};
