import { useRouteError } from "react-router";

const ErrorBoundary = () => {
	const error = useRouteError() as Response;

	return (
		<div className="p-4 m-4 border border-red-300 rounded-md">
			<h1>{error.status}</h1>
			<h2 className="text-red-500">{error.statusText || `${error}`}</h2>
			<p>This is the error boundary based on `/users/*`</p>
		</div>
	);
};

export default ErrorBoundary;