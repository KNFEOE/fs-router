import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import {  useMount} from 'ahooks'
import { type ReactElement, startTransition, useState } from "react";

export default function App() {
	const element = useRoutes(routes);

	const [display, setDisplay] = useState<ReactElement | null>(null);

	useMount(() => {
		startTransition(() => {
			setDisplay(element);
		});
	});

	return display;
}
