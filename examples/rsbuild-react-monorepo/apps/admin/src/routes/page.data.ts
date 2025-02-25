export const loader = function rootLayoutLoader(...args: any[]) {
	console.log("layoutLoader called", args);

	return {
		code: 0,
		data: {
			name: "@app/admin from page.data",
		},
	};
};