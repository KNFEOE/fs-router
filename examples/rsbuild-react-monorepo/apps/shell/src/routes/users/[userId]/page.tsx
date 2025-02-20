import { useParams } from "react-router";

const Page = () => {
	const params = useParams<{ userId: string }>();
	console.log(params);

	return <div>/user/[userId={params.userId}] Page</div>;
};

export default Page;
