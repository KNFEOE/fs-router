import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import './global.css';

const router = createBrowserRouter(routes);

export default function DataRouterApp() {
  return <RouterProvider router={router} />;
}