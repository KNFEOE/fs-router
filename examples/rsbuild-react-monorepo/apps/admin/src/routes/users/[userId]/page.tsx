import { useLoaderData, useMatches } from "react-router-dom";
import type { loader } from "./page.data";

const Page = () => {
	const res = useLoaderData<typeof loader>();
	console.log(res);
	const { code, data } = res || {};
	const { user } = data;
	const matches = useMatches();
	console.log(matches);

	return (
		<div>
			<h1>User</h1>
			<h2>Code: {code}</h2>
			<div>
				<img src={user.avatar} alt={user.name} />
				<h1>{user.name}</h1>
				<p>{user.email}</p>
				<p>{user.phone}</p>
				<p>{user.website}</p>
			</div>
		</div>
	);
};

export default Page;
