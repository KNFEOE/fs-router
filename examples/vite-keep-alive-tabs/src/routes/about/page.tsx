import { PageContainer, ProCard, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";

export default function AboutPage() {
  console.log('AboutPage render');
  return (
    <PageContainer title="About" extra={<Button type="primary">Button</Button>}>
      <ProCard title="Welcome to AboutPage" />
      <ProTable />
    </PageContainer>
  );
}