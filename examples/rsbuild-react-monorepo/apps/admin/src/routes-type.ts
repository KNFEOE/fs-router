declare module "@feoe/fs-router" {
			interface RouteTypes {
        "/": {};
        "/users": {};
        "/users/:userId": {};
        "/admin": {};
        "/admin/about": {};
        "/admin/users": {};
        "/admin/users/:userId": {};
        "/admin/:type/detail/:id": {};
			}
		};
export {};