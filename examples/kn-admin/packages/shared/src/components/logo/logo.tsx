import type { BoxProps } from "@mui/material/Box";

import { forwardRef } from "react";

import Box from "@mui/material/Box";

import { logoClasses } from "./classes";
import { RouterLink } from "@/routes/components";

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
	href?: string;
	isSingle?: boolean;
	disableLink?: boolean;
};

const LoginIconSrc =
	"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiIHZpZXdCb3g9IjAgMCAxMDgwIDEwODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHJlY3QgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiB4PSItNTQwIiB5PSItNTQwIiByeD0iMCIgcnk9IjAiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNmZmYiIHZpc2liaWxpdHk9ImhpZGRlbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTQwIDU0MCkiLz48ZyB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiPjxwYXRoIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgZmlsbD0iIzAwYTVlMyIgZD0iTTc2NS44ODEgMzE3LjU1OUg1NDEuNTAzTDMxNy41NTkgNTQxLjUwM2wyMjMuOTQ0IDIyNC4zNzhoMjI0LjM3OEw1NDEuNTAzIDU0MS41MDN6Ii8+PHBhdGggdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiBkPSJNNzA0LjY4NyAxNjkuOTk5aDM3Ljc1OGwtMjYuNDc0LTI2LjQ3NEw1OTMuNTgzIDIxLjEzN2wtNC43NzQtNC43NzRoLTI3MS4yNWMtMTY1Ljc4OCAwLTMwMC43NjIgMTM0Ljk3NC0zMDAuNzYyIDMwMC43NjJ2NDA3LjUyNmMwIDY0LjY2NiA1Mi41MTQgMTE3LjYxNCAxMTcuNjE0IDExNy42MTRoOTcuMjE2VjMzNy45NTdjMC05Mi40NDIgNzUuMDgyLTE2Ny45NTggMTY3Ljk1OC0xNjcuOTU4aDMwNS4xMDJ6TTk0OS4wMjkgMjQwLjc0MWgtOTcuMjE2djUwNC43NDJjMCA5Mi40NDItNzUuMDgyIDE2Ny45NTgtMTY3Ljk1OCAxNjcuOTU4aC0zNDIuODZsMjYuNDc0IDI2LjQ3NCAxMjIuMzg4IDEyMi4zODggNC43NzQgNC43NzRoMjcxLjI1YzE2NS43ODggMCAzMDAuNzYyLTEzNC45NzQgMzAwLjc2Mi0zMDAuNzYyVjM1OC43ODljMC02NS41MzQtNTIuOTQ4LTExOC4wNDgtMTE3LjYxNC0xMTguMDQ4eiIgZmlsbD0iIzFkMjA4OCIvPjwvZz48L3N2Zz4=";

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
	(
		{
			width,
			href = "/",
			height,
			isSingle = true,
			disableLink = false,
			className,
			sx,
			...other
		},
		ref,
	) => {
		const singleLogo = (
			<img
				src={LoginIconSrc}
				alt="Login Icon"
				style={{ width: 40, height: 40 }}
			/>
		);
		const fullLogo = (
			<img
				src={LoginIconSrc}
				alt="Login Icon"
				style={{ width: 40, height: 40 }}
			/>
		);

		const baseSize = {
			width: width ?? 40,
			height: height ?? 40,
			...(!isSingle && {
				width: width ?? 102,
				height: height ?? 36,
			}),
		};

		return (
			<Box
				ref={ref}
				component={RouterLink}
				href={href}
				className={logoClasses.root.concat(className ? ` ${className}` : "")}
				aria-label="Logo"
				sx={{
					...baseSize,
					flexShrink: 0,
					display: "inline-flex",
					verticalAlign: "middle",
					...(disableLink && { pointerEvents: "none" }),
					...sx,
				}}
				{...other}
			>
				{isSingle ? singleLogo : fullLogo}
			</Box>
		);
	},
);
