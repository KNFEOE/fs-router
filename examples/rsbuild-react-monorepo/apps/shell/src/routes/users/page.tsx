import { useLoaderData } from "react-router-dom";
import type { loader as usersLayoutLoader } from "./page.data";

const Page = () => {
	const { data } = useLoaderData() as Awaited<
		ReturnType<typeof usersLayoutLoader>
	>;

	console.log("data: ", data);

	return <div>/user Page</div>;
};

export default Page;
