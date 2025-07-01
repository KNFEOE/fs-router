import type { LoaderFunctionArgs } from "react-router-dom";
import { users } from "../data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const userId = params.userId;
	const user = users.find((user) => user.id === Number(userId));

	if (!user) {
		throw new Error("User not found");
	}

	return {
		code: 0,
		data: {
			user: user,
		},
	};
};
