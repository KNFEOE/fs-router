export type RouterParam = {
	name: string;
	optional?: boolean;
};

export type PathParserResult = {
	route: string;
	params: RouterParam[];
};

export function pathParser(path: string): PathParserResult {
	// 移除开头和结尾的斜杠
	const normalizedPath = path.replace(/^\/+|\/+$/g, "");
	// 移除文件后缀名
	const pathWithoutExt = normalizedPath.replace(/\.[jt]sx?$/, "");
	const pathSegments = pathWithoutExt.split("/");
	const params: RouterParam[] = [];

	// 过滤掉 (group) 分组和 __开头的目录，并处理每个路径段
	const processedSegments = pathSegments
		.filter((segment) => !segment.startsWith("(") && !segment.endsWith(")") && !segment.startsWith("__"))
		.map((segment) => {
			// 处理可选参数 [param$]
			const optionalMatch = segment.match(/^\[([.\w]+)\$\]$/);
			if (optionalMatch) {
				const name = optionalMatch[1];
				params.push({
					name,
					optional: true,
				});
				return `:${name}?`;
			}

			// 处理 catch-all 参数 $
			if (segment === "$") {
				params.push({
					name: "*",
					optional: false,
				});
				return "*";
			}

			// 处理可选参数 [[param]]
			const optionalBracketMatch = segment.match(/^\[\[([.\w]+)\]\]$/);
			if (optionalBracketMatch) {
				const name = optionalBracketMatch[1];
				// 处理可选的 catch-all 参数
				if (name.startsWith("...")) {
					params.push({
						name: "*",
						optional: true,
					});
					return "*?";
				}
				params.push({
					name,
					optional: true,
				});
				return `:${name}?`;
			}

			// 处理必需参数 [param]
			const requiredMatch = segment.match(/^\[([.\w]+)\]$/);
			if (requiredMatch) {
				const name = requiredMatch[1];
				// 处理必需的 catch-all 参数
				if (name.startsWith("...")) {
					params.push({
						name: "*",
						optional: false,
					});
					return "*";
				}
				params.push({
					name,
				});
				return `:${name}`;
			}

			return segment;
		});

	// 如果最后一个段是 'page'，则移除它
	if (processedSegments[processedSegments.length - 1] === "page") {
		processedSegments.pop();
	}

	return {
		route: processedSegments.join("/"),
		params,
	};
}

