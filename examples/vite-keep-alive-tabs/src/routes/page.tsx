import { PageContainer, ProCard, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";

export default function IndexPage() {
	console.log('IndexPage Render');
	return (
		<PageContainer title="Home" extra={<Button type="primary">Button</Button>}>
			<ProCard title="Welcome to IndexPage" />
			<ProTable />
		</PageContainer>
	);
}