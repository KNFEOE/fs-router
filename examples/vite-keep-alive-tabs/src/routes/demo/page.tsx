import { memo, useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";

export default memo(function DemoPage() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="flex gap-2">
				<a className="text-blue-500" href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a className="text-blue-500" href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button
					className="bg-blue-500 text-white rounded-md p-2"
					type="button"
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}
)