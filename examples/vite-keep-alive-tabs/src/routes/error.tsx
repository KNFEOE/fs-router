import { useRouteError } from 'react-router-dom-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return <div className="text-red-500">Error: {String(error)}</div>;
}
