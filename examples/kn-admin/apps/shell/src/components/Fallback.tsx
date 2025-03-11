import { Box, LinearProgress, linearProgressClasses } from "@mui/material";
import { styles } from "@kn-admin/shared";

export default function Fallback() {
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			flex="1 1 auto"
		>
			<LinearProgress
				sx={{
					width: 1,
					maxWidth: 320,
					bgcolor: (theme) => styles.varAlpha(theme.palette.text.primary, 0.16),
					[`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
				}}
			/>
		</Box>
	);
}
