// wdyr.ts
import React from "react";

if (process.env.NODE_ENV === "development") {
	import("@welldone-software/why-did-you-render").then((module) => {
		const whyDidYouRender = module.default;
		whyDidYouRender(React, {
			trackAllPureComponents: true, // 自动追踪所有 PureComponent/Memo 组件
			/* trackExtraHooks: [
					// 添加需要追踪的 hooks（如 Redux）
					["useTabStore", "useRouteTransition"],
				], */
			logOnDifferentValues: true, // 显示 props 差异
			collapseGroups: true, // 折叠控制台日志组
		});
	});
}