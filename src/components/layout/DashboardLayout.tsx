import React from 'react';
import { Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  onNavigateHome?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showBreadcrumbs = false,
  onNavigateHome,
}) => {
  const theme = useTheme();
  const sidebarWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar width={sidebarWidth} onNavigateHome={onNavigateHome} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Header showBreadcrumbs={showBreadcrumbs} />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
