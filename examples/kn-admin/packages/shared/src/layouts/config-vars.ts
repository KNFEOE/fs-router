import type { Theme } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

export const baseVars = (theme: Theme) => ({
  // nav
  '--layout-nav-bg': theme.palette.common.white,
  '--layout-nav-border-color': varAlpha(theme.palette.grey[500], 0.08),
  '--layout-nav-zIndex': 1101,
  '--layout-nav-mobile-width': '320px',
  // nav item
  '--layout-nav-item-height': '44px',
  '--layout-nav-item-color': theme.palette.text.secondary,
  '--layout-nav-item-active-color': theme.palette.primary.main,
  '--layout-nav-item-active-bg': varAlpha(theme.palette.primary.main, 0.08),
  '--layout-nav-item-hover-bg': varAlpha(theme.palette.primary.main, 0.16),
  // header
  '--layout-header-blur': '8px',
  '--layout-header-zIndex': 1100,
  '--layout-header-mobile-height': '64px',
  '--layout-header-desktop-height': '72px',
});
