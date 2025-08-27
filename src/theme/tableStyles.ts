import { Theme } from '@mui/material/styles';

// Reusable table styling configurations
export const tableStyles = {
  // Grid column templates for responsive table layouts
  getGridColumns: (isDeleteMode: boolean, isMobile: boolean, isTablet: boolean) => {
    if (isMobile) {
      // Mobile: Single-line format needs less space
      return isDeleteMode 
        ? '40px 280px 160px 140px 120px 100px'  // With checkbox - 6 columns total
        : '280px 160px 140px 120px 100px';      // Without checkbox - 5 columns total
    } else if (isTablet) {
      // Tablet: Balanced space distribution with single-line efficiency  
      return isDeleteMode 
        ? '40px 2fr 1.2fr 1fr 0.8fr 100px' 
        : '2fr 1.2fr 1fr 0.8fr 100px';
    } else {
      // Desktop: Well-balanced columns with single-line first column
      return isDeleteMode 
        ? '40px 1.8fr 1.2fr 1fr 0.8fr 120px' 
        : '1.8fr 1.2fr 1fr 0.8fr 120px';
    }
  },

  // Common table container styles
  tableContainer: (theme: Theme) => ({
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
  }),

  // Table paper wrapper styles
  tablePaper: (theme: Theme, isMobile: boolean) => ({
    borderRadius: '12px',
    border: `1px solid ${theme.palette.grey[200]}`,
    overflow: 'hidden',
    width: '100%',
    minWidth: isMobile ? '820px' : '100%',
  }),

  // Table header styles
  tableHeader: (theme: Theme, gridColumns: string) => ({
    display: 'grid',
    gridTemplateColumns: gridColumns,
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    transition: 'grid-template-columns 0.3s ease',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  }),

  // Table row styles
  tableRow: (theme: Theme, gridColumns: string, isHovered: boolean = false) => ({
    display: 'grid',
    gridTemplateColumns: gridColumns,
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  }),

  // Sortable header cell styles
  sortableHeader: (theme: Theme, isActive: boolean = false, direction?: 'asc' | 'desc') => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none' as const,
    '&:hover': {
      color: theme.palette.primary.main,
    },
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: isActive ? 600 : 500,
    '& .sort-icon': {
      opacity: isActive ? 1 : 0.5,
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      transform: direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
    },
  }),

  // Avatar cell styles
  avatarCell: (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  }),

  // Avatar styles
  avatar: (theme: Theme) => ({
    width: 40,
    height: 40,
    backgroundColor: theme.palette.primary.main,
    fontSize: '0.875rem',
    fontWeight: 600,
  }),

  // Employee info styles (name + email)
  employeeInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    minWidth: 0, // Allow text truncation
  },

  employeeName: (theme: Theme) => ({
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    lineHeight: 1.2,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  employeeEmail: (theme: Theme) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.2,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  // Empty state styles
  emptyState: (theme: Theme) => ({
    padding: theme.spacing(8),
    textAlign: 'center' as const,
    color: theme.palette.text.secondary,
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: '4rem',
    color: theme.palette.grey[400],
    marginBottom: theme.spacing(2),
  }),

  // Bulk selection toolbar styles
  bulkToolbar: (theme: Theme) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light + '10',
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: '8px',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  }),

  // Department filter chip styles
  filterChip: (theme: Theme) => ({
    backgroundColor: theme.palette.primary.light + '20',
    '& .MuiChip-label': { fontWeight: 500 },
  }),
};

// Responsive breakpoint utilities for tables
export const tableBreakpoints = {
  mobile: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 1199px)',
  desktop: '(min-width: 1200px)',
};