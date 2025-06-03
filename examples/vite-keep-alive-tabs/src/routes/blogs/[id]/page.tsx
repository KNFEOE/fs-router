import { Link, useParams } from "react-router";
import { blogs } from "../data";
import { memo } from "react";

export default memo(function BlogDetailPage() {
	const { id } = useParams();

	return (
		<div className="flex flex-col gap-4 rounded-lg shadow-md bg-white p-4">
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
				<button className="bg-blue-500 text-white rounded-md p-2" type="button">
					Save
				</button>
			</div>
		</div>
	);
})