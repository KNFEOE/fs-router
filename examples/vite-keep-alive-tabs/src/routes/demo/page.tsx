import { memo, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';

export default memo(function DemoPage() {
  console.log('DemoPage render');
  const [count, setCount] = useState(0);

  return (
    <PageContainer title="Home" extra={<Button type="primary">Button</Button>}>
      <ProCard title="Welcome to DemoPage">
        <>
          <div className="flex gap-2">
            <a
              className="text-blue-500"
              href="https://vite.dev"
              target="_blank"
              rel="noreferrer"
            >
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a
              className="text-blue-500"
              href="https://react.dev"
              target="_blank"
              rel="noreferrer"
            >
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button
              className="bg-blue-500 text-white rounded-md p-2"
              type="button"
              onClick={() => setCount(count => count + 1)}
            >
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </>
      </ProCard>
      <ProTable />
    </PageContainer>
  );
});
