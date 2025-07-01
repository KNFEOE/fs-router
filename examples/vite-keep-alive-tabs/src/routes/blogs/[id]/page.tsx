import { Link, useParams } from 'react-router-dom-dom';
import { blogs } from "../data";
import { memo } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Button } from "antd";

export default memo(function BlogDetailPage() {
	const { id } = useParams();
	console.log('BlogDetailPage render : ', id);

	return (
		<PageContainer
			title="BlogDetailPage"
			subTitle="Welcome to BlogDetailPage"
			extra={<Button type="primary">Button</Button>}
		>
			<ProCard>
				<div className="flex justify-between items-center">
					<h1>BlogDetailPage {id}</h1>
					<Link className="text-blue-500" to="/blogs">
						Back to blogs
					</Link>
				</div>
				<div>
					<p>{blogs.find((blog) => blog.id === Number(id))?.content}</p>
				</div>

				<div className="flex gap-2">
					<input
						className="flex-1 border border-gray-300 rounded-md p-2"
						type="text"
						placeholder="Edit content"
					/>
					<button
						className="bg-blue-500 text-white rounded-md p-2"
						type="button"
					>
						Save
					</button>
				</div>
			</ProCard>
		</PageContainer>
	);
})