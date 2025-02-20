export const loader = function usersLayoutLoader() {
	return {
		code: 0,
		data: {
			users: [
				{
					id: 1,
					name: "John Doe",
					email: "john@doe.com",
					phone: "1234567890",
					avatar: "https://avatars.githubusercontent.com/u/7237365?s=64&v=4",
					website: "https://john.doe",
				},
				{
					id: 3,
					name: "Jim Doe",
					email: "jim@doe.com",
					phone: "1234567890",
					avatar: "https://avatars.githubusercontent.com/u/12605189?s=64&v=4",
					website: "https://jim.doe",
				},
			],
		},
	};
}
