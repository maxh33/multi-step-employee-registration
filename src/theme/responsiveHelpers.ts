import { Theme, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Responsive breakpoint utilities
export const breakpoints = {
  xs: '(max-width: 599px)',
  sm: '(min-width: 600px) and (max-width: 899px)',
  md: '(min-width: 900px) and (max-width: 1199px)',
  lg: '(min-width: 1200px) and (max-width: 1535px)',
  xl: '(min-width: 1536px)',
  
  // Custom breakpoints for specific use cases
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  
  // Touch device detection
  touch: '(hover: none) and (pointer: coarse)',
  desktop_hover: '(hover: hover) and (pointer: fine)',
};

// Grid template configurations for different screen sizes
export const gridTemplates = {
  // Employee table grid templates
  employeeTable: {
    mobile: 'minmax(280px, 1fr) minmax(160px, auto) minmax(140px, auto) minmax(120px, auto) minmax(100px, auto)',
    tablet: '2fr 1.2fr 1fr 0.8fr 100px',
    desktop: '1.8fr 1.2fr 1fr 0.8fr 120px',
    
    // With checkbox for bulk actions
    mobileWithCheckbox: '40px minmax(280px, 1fr) minmax(160px, auto) minmax(140px, auto) minmax(120px, auto) minmax(100px, auto)',
    tabletWithCheckbox: '40px 2fr 1.2fr 1fr 0.8fr 100px',
    desktopWithCheckbox: '40px 1.8fr 1.2fr 1fr 0.8fr 120px',
  },

  // Department table grid templates
  departmentTable: {
    mobile: 'minmax(200px, 1fr) minmax(120px, auto) minmax(100px, auto)',
    tablet: '2fr 1fr auto',
    desktop: '2fr 1fr auto',
    
    // With checkbox for bulk actions
    mobileWithCheckbox: '40px minmax(200px, 1fr) minmax(120px, auto) minmax(100px, auto)',
    tabletWithCheckbox: '40px 2fr 1fr auto',
    desktopWithCheckbox: '40px 2fr 1fr auto',
  },

  // Form grid templates
  form: {
    // Single column (mobile-first)
    singleColumn: '1fr',
    
    // Two columns
    twoColumn: {
      mobile: '1fr',
      tablet: '1fr 1fr',
      desktop: '1fr 1fr',
    },
    
    // Three columns
    threeColumn: {
      mobile: '1fr',
      tablet: '1fr 1fr',
      desktop: '1fr 1fr 1fr',
    },
    
    // Auto-fit columns
    autoFit: 'repeat(auto-fit, minmax(280px, 1fr))',
    autoFill: 'repeat(auto-fill, minmax(280px, 1fr))',
  },

  // Dashboard layout templates
  dashboard: {
    mobile: '1fr',
    tablet: '280px 1fr',
    desktop: '320px 1fr',
  },

  // Card grid templates
  cardGrid: {
    mobile: '1fr',
    tablet: 'repeat(2, 1fr)',
    desktop: 'repeat(3, 1fr)',
    wide: 'repeat(4, 1fr)',
  },
};

// Spacing scales for different screen sizes
export const responsiveSpacing = (theme: Theme) => ({
  // Container padding
  containerPadding: {
    mobile: theme.spacing(2),
    tablet: theme.spacing(3),
    desktop: theme.spacing(4),
  },

  // Section spacing
  sectionSpacing: {
    mobile: theme.spacing(3),
    tablet: theme.spacing(4),
    desktop: theme.spacing(6),
  },

  // Element gaps
  elementGap: {
    mobile: theme.spacing(1),
    tablet: theme.spacing(2),
    desktop: theme.spacing(3),
  },

  // Table padding
  tablePadding: {
    mobile: theme.spacing(1.5, 2),
    tablet: theme.spacing(2, 3),
    desktop: theme.spacing(2, 3),
  },
});

// Typography scales for different screen sizes
export const responsiveTypography = (theme: Theme) => ({
  // Heading scales
  heading: {
    h1: {
      mobile: '1.75rem',
      tablet: '2.25rem',
      desktop: '2.5rem',
    },
    h2: {
      mobile: '1.5rem',
      tablet: '1.75rem',
      desktop: '2rem',
    },
    h3: {
      mobile: '1.25rem',
      tablet: '1.5rem',
      desktop: '1.75rem',
    },
  },

  // Body text scales
  body: {
    large: {
      mobile: '1rem',
      tablet: '1.125rem',
      desktop: '1.125rem',
    },
    medium: {
      mobile: '0.875rem',
      tablet: '1rem',
      desktop: '1rem',
    },
    small: {
      mobile: '0.75rem',
      tablet: '0.875rem',
      desktop: '0.875rem',
    },
  },

  // Table text scales
  table: {
    header: {
      mobile: '0.75rem',
      tablet: '0.875rem',
      desktop: '0.875rem',
    },
    cell: {
      mobile: '0.75rem',
      tablet: '0.875rem',
      desktop: '0.875rem',
    },
  },
});

// Custom hook for responsive grid columns
export const useResponsiveGrid = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const getEmployeeTableColumns = (hasCheckbox: boolean = false) => {
    if (isMobile) {
      return hasCheckbox 
        ? gridTemplates.employeeTable.mobileWithCheckbox
        : gridTemplates.employeeTable.mobile;
    } else if (isTablet) {
      return hasCheckbox
        ? gridTemplates.employeeTable.tabletWithCheckbox
        : gridTemplates.employeeTable.tablet;
    } else {
      return hasCheckbox
        ? gridTemplates.employeeTable.desktopWithCheckbox
        : gridTemplates.employeeTable.desktop;
    }
  };

  const getDepartmentTableColumns = (hasCheckbox: boolean = false) => {
    if (isMobile) {
      return hasCheckbox
        ? gridTemplates.departmentTable.mobileWithCheckbox
        : gridTemplates.departmentTable.mobile;
    } else if (isTablet) {
      return hasCheckbox
        ? gridTemplates.departmentTable.tabletWithCheckbox
        : gridTemplates.departmentTable.tablet;
    } else {
      return hasCheckbox
        ? gridTemplates.departmentTable.desktopWithCheckbox
        : gridTemplates.departmentTable.desktop;
    }
  };

  const getFormColumns = (columnCount: 1 | 2 | 3) => {
    if (columnCount === 1) return gridTemplates.form.singleColumn;
    
    if (columnCount === 2) {
      if (isMobile) return gridTemplates.form.twoColumn.mobile;
      return gridTemplates.form.twoColumn.desktop;
    }

    if (columnCount === 3) {
      if (isMobile) return gridTemplates.form.threeColumn.mobile;
      if (isTablet) return gridTemplates.form.threeColumn.tablet;
      return gridTemplates.form.threeColumn.desktop;
    }

    return gridTemplates.form.singleColumn;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    getEmployeeTableColumns,
    getDepartmentTableColumns,
    getFormColumns,
    spacing: responsiveSpacing(theme),
    typography: responsiveTypography(theme),
  };
};

// Custom hook for responsive values
export const useResponsiveValue = <T>(mobileValue: T, tabletValue?: T, desktopValue?: T): T => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  if (isMobile) return mobileValue;
  if (isTablet && tabletValue !== undefined) return tabletValue;
  return desktopValue !== undefined ? desktopValue : tabletValue || mobileValue;
};

// Utility function to create responsive styles
export const createResponsiveStyles = (theme: Theme) => {
  return {
    // Helper for responsive padding
    responsivePadding: (mobile: string | number, tablet?: string | number, desktop?: string | number) => ({
      padding: mobile,
      [theme.breakpoints.up('sm')]: {
        padding: tablet || mobile,
      },
      [theme.breakpoints.up('lg')]: {
        padding: desktop || tablet || mobile,
      },
    }),

    // Helper for responsive margin
    responsiveMargin: (mobile: string | number, tablet?: string | number, desktop?: string | number) => ({
      margin: mobile,
      [theme.breakpoints.up('sm')]: {
        margin: tablet || mobile,
      },
      [theme.breakpoints.up('lg')]: {
        margin: desktop || tablet || mobile,
      },
    }),

    // Helper for responsive font size
    responsiveFontSize: (mobile: string | number, tablet?: string | number, desktop?: string | number) => ({
      fontSize: mobile,
      [theme.breakpoints.up('sm')]: {
        fontSize: tablet || mobile,
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: desktop || tablet || mobile,
      },
    }),

    // Helper for responsive grid
    responsiveGrid: (mobileTemplate: string, tabletTemplate?: string, desktopTemplate?: string) => ({
      display: 'grid',
      gridTemplateColumns: mobileTemplate,
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: tabletTemplate || mobileTemplate,
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: desktopTemplate || tabletTemplate || mobileTemplate,
      },
    }),
  };
};

// Viewport size categories
export const viewportCategories = {
  isSmall: '(max-width: 767px)',
  isMedium: '(min-width: 768px) and (max-width: 1199px)',
  isLarge: '(min-width: 1200px)',
  isXLarge: '(min-width: 1536px)',
  
  // Orientation
  isPortrait: '(orientation: portrait)',
  isLandscape: '(orientation: landscape)',
  
  // Density
  isHighDensity: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  isLowDensity: '(-webkit-max-device-pixel-ratio: 1.5), (max-resolution: 144dpi)',
};