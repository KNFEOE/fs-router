import { memo } from "react";
import { blogs } from "./data";
import { Link } from "react-router";

export default memo(function BlogsPage() {
	return (
		<div className="grid grid-cols-3 gap-4">
			{blogs.map((blog) => (
				<div key={blog.id} className="bg-white p-4 rounded-lg shadow-md">
					<div className="flex justify-between items-center">
						<Link className="text-blue-500" to={`/blogs/${blog.id}`}>
							<h2 className="text-lg font-bold">{blog.title}</h2>
						</Link>
					</div>
					<p className="text-sm text-gray-600 mt-2">{blog.content}</p>
				</div>
			))}
		</div>
	);
})