import { useLoaderData } from "react-router-dom";
import type { loader as rootLayoutLoader } from "./page.data";

const Page = () => {
	const { data } = useLoaderData() as Awaited<
		ReturnType<typeof rootLayoutLoader>
	>;
	console.log("page data from root page", data);

	return (
		<div className="w-svw h-svh flex flex-col items-center justify-center bg-red-500">
			/ Root Page
			<div>{data.name}</div>
		</div>
	);
};

export default Page;
