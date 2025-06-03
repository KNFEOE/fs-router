import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return <div className="text-red-500">Error: {String(error)}</div>;
}
