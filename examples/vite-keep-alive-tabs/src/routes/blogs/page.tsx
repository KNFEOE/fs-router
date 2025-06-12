import { memo } from "react";
import { Link, useLoaderData } from "react-router";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import type { loader } from "./page.data";

export default memo(function BlogsPage() {
	const blogs = useLoaderData<Awaited<ReturnType<typeof loader>>>();
	console.log("blogs: ", blogs);

	return (
		<PageContainer
			title="Blogs"
			subTitle="Welcome to BlogsPage"
			extra={<Button type="primary">Button</Button>}
		>
			<ProTable
				dataSource={blogs}
				rowKey="id"
				columns={[
					{
						title: "Title",
						dataIndex: "title",
						key: "title",
					},
					{
						title: "Content",
						dataIndex: "content",
						key: "content",
					},
					{
						title: "Action",
						dataIndex: "action",
						key: "action",
						render: (_, record) => (
							<Link className="text-blue-500" to={`/blogs/${record.id}`}>
								Edit
							</Link>
						),
					},
				]}
			/>
		</PageContainer>
	);
})