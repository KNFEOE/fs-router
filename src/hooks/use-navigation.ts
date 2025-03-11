/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-11 19:26:23
 */
import { useMemo } from "react";
import {
	useNavigate,
	type NavigateOptions,
	generatePath,
	type PathParam,
	Path,
	replace,
} from "react-router";
import type { RouteTypes } from "../types/route-type";

export interface NavigationOptions extends NavigateOptions {}

export type PathParameters<Path extends string> = Required<
	PathParam<Path>
>["length"] extends 0
	? [
			path: Path,
			params?: {
				[key in PathParam<Path>]: string | number | boolean;
			},
			query?: Record<string, string>,
		]
	: [
			path: Path,
			params: {
				[key in PathParam<Path>]: string | number | boolean;
			},
			query?: Record<string, string>,
		];
export function useNavigation() {
	const navigate = useNavigate();

	const navigation = useMemo(() => {
		const buildHref = <Path extends keyof RouteTypes>(
			...args: PathParameters<Path>
		) => {
			const [path, params, query] = args;
			let href = generatePath(
				path,
				params as {
					[key in PathParam<Path>]: string | null;
				},
			);

			if (query) {
				if (href.includes("?")) {
					href += `&${new URLSearchParams(query).toString()}`;
				} else {
					href += `?${new URLSearchParams(query).toString()}`;
				}
			}

			return href;
		};
		return {
			back() {
				return navigate(-1);
			},
			forward() {
				return navigate(1);
			},
			reload() {
				return location.reload();
			},
			buildHref,
			push<Path extends keyof RouteTypes>(...args: PathParameters<Path>) {
				return navigate(buildHref<Path>(...args));
			},
			replace<Path extends keyof RouteTypes>(...args: PathParameters<Path>) {
				return navigate(buildHref<Path>(...args), {
					replace: true,
				});
			},
		};
	}, [navigate]);

	return navigation;
}
