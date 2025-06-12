import { ProSkeleton } from "@ant-design/pro-components";
import { Skeleton, Spin } from "antd";

/**
 * @see {@link [Loading(Experimental)](https://modernjs.dev/guides/basic-features/routes.html)}
 * 当路由目录下同时存在该组件和 layout 组件时，
 * 这一级路由下所有的子路由切换时，会先展示 loading.tsx 中导出的组件 UI，
 * 直到对应的 JS Chunk 加载完成。
 * @returns
 */
export default function Loading() {
	return (
		<Spin spinning>
			<div className="flex flex-col divide-y divide-gray-200 w-full h-full min-h-screen">
				<div className="h-14 mx-4 flex flex-row items-center gap-4">
					<Skeleton.Input
						className="flex-1 !flex flex-col items-center justify-center h-8 !w-full"
						active
					/>
					<Skeleton.Avatar active size="large" />
					<Skeleton.Button active />
				</div>
				<div className="flex flex-1 flex-row gap-4 divide-x divide-gray-200">
					<div className="flex flex-col justify-between w-60 xl:w-70 2xl:w-80">
						<Skeleton
							loading={true}
							style={{
								padding: "1rem",
							}}
							active
							paragraph={{ rows: 12 }}
						/>

						<Skeleton.Input className="text-center !w-ful" active />
					</div>
					<div className="w-full p-10">
						<ProSkeleton type="list" />
					</div>
				</div>
			</div>
		</Spin>
	);
}
