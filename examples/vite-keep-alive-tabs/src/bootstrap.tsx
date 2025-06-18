import ReactDOM from 'react-dom/client';
import BrowserRouterApp from './BrowserRouterApp';
import DataRouterApp from './DataRouterApp';

// 渲染应用
const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  root.render(<DataRouterApp />);
}
