import { defineConfig } from "rspress/config";

/**
 * RSPress 配置文件
 *
 * 注意：导航栏和侧边栏配置已迁移到 _meta.json 文件系统
 * - 根级导航：docs/_meta.json
 * - 各目录侧边栏：docs/{section}/_meta.json
 *
 * 这种方式提供了更好的可维护性和自动化程度，
 * 新增页面时无需手动修改此配置文件。
 */
export default defineConfig({
	// 基础配置
	root: ".",
	base: "/fs-router/",
	title: "@feoe/fs-router",
	description:
		"一个基于文件的约定式路由 & 运行时路由实现，为 React 应用提供类型安全的路由解决方案",
	icon: "/logo.svg",
	logo: {
		light: "/logo.svg",
		dark: "/logo.svg",
	},

	// 多语言配置
	lang: "zh",

	// SEO 和元数据配置
	head: [
		[
			"meta",
			{
				name: "keywords",
				content:
					"React, Router, TypeScript, File-based, Convention, Vite, Webpack, Rspack",
			},
		],
		["meta", { name: "author", content: "@feoe team" }],
		["meta", { property: "og:type", content: "website" }],
		["meta", { property: "og:title", content: "@feoe/fs-router" }],
		[
			"meta",
			{
				property: "og:description",
				content:
					"一个基于文件的约定式路由 & 运行时路由实现，为 React 应用提供类型安全的路由解决方案",
			},
		],
		["meta", { property: "og:image", content: "/logo.svg" }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
	],

	// 主题配置
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				mode: "link",
				content: "https://github.com/feoe/fs-router",
			},
		],
		editLink: {
			docRepoBaseUrl: "https://github.com/feoe/fs-router/tree/main/docs",
			text: "📝 在 GitHub 上编辑此页",
		},
		lastUpdated: true,
		lastUpdatedText: "最后更新时间",
		prevPageText: "上一页",
		nextPageText: "下一页",
		outlineTitle: "页面导航",
		searchPlaceholderText: "搜索文档",
		footer: {
			message: "基于 MIT 许可发布 | Copyright © 2024 @feoe",
		},
	},

	// 构建配置
	builderConfig: {
		html: {
			tags: [
				{
					tag: "link",
					attrs: {
						rel: "preconnect",
						href: "https://fonts.googleapis.com",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "preconnect",
						href: "https://fonts.gstatic.com",
						crossorigin: true,
					},
				},
			],
		},
	},

	// Markdown 配置
	markdown: {
		showLineNumbers: true,
		codeHighlighter: "prism",
	},
});
