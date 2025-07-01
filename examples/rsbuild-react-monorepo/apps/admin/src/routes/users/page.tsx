import { useLoaderData } from "react-router-dom";
import { Link } from "@/components/SmartLink";
import type { loader as usersLayoutLoader } from "./page.data";

const Page = () => {
	const { data } = useLoaderData() as Awaited<
		ReturnType<typeof usersLayoutLoader>
	>;
	const users = data.users ?? [];

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Users</h1>
			<ul className="flex flex-col gap-2">
				{users.map((user) => (
					<li key={user.id}>
						<div className="flex items-center gap-2">
							<img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
							<Link className="text-blue-500 hover:text-blue-600" to={`/users/${user.id}`}>{user.name}</Link>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Page;
