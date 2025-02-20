import { users } from "./data"

export const loader = function usersLayoutLoader() {
	return {
		code: 0,
		data: {
			users: users,
		},
	};
}
