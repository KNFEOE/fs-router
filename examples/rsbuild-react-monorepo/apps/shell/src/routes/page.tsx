import { useLoaderData } from "react-router-dom";
import type { loader as rootLayoutLoader } from "./page.data";
import { useEffect } from "react";

const Page = () => {
	const { data } = useLoaderData() as Awaited<
		ReturnType<typeof rootLayoutLoader>
	>;

	useEffect(() => {
		console.log("after rendered data on root page", data);
	}, [data]);

	return (
		<div className="w-svw h-svh flex flex-col items-center justify-center bg-red-500">
			/ Root Page
			<div>{data.name}</div>
		</div>
	);
};

export default Page;
