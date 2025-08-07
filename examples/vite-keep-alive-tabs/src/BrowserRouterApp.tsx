import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import './global.css';

export function App() {
  return <>{useRoutes(routes)}</>;
}

export default function BrowserRouterApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}