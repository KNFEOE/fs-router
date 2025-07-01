import { Header } from "@/components/Header";
import { Outlet, useLoaderData } from "react-router-dom";
import "./global.css";
import type { loader as layoutLoader } from "./layout.data";
import { useEffect } from "react";

export default function Layout() {
	const { data } = useLoaderData() as Awaited<
		ReturnType<typeof layoutLoader>
	>;

	useEffect(() => {
		console.log("after rendered data on root layout	", data);
	}, [data]);

	return (
		<div className="flex flex-col size-full min-w-screen min-h-screen">
			<Header />
			<h1 className="text-2xl font-bold p-4 bg-amber-400">
				This is the root Layout based on {data.name}
			</h1>
			<Outlet />
		</div>
	);
}
