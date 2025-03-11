import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MaterialThemeProvider } from "@mui/material/styles";

import { createTheme } from "./create-theme";

// ----------------------------------------------------------------------

type Props = {
	children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
	const theme = createTheme();

	return (
		<MaterialThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</MaterialThemeProvider>
	);
}
