import { Link, useLoaderData } from "react-router-dom";

export default function Page() {
	console.log("page", useLoaderData());
	return (
		<div>
			Shell Home Page
			<Link to="/dashboard">dashboard</Link>
		</div>
	);
}
