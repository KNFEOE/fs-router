export const DefaultErrorBoundary = `
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function DefaultErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data?.message}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>Something went wrong</p>
    </div>
  );
}
`

export const DefaultLoadingFallback = `
import { Suspense } from 'react';

export const DefaultLoadingFallback = () => (
  <Suspense fallback={<div>Loading...</div>} />
);
`