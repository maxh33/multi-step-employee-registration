import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        width={sidebarWidth}
        onNavigateHome={onNavigateHome}
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
      />

      {/* Mobile toggle button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: theme.zIndex.drawer + 2,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            display: mobileOpen ? 'none' : 'flex',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
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
            paddingLeft: isMobile ? theme.spacing(2) : theme.spacing(4),
            paddingRight: theme.spacing(isMobile ? 2 : 3),
            paddingTop: isMobile ? theme.spacing(8) : theme.spacing(3), // Extra top padding for mobile toggle button
            paddingBottom: theme.spacing(3),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
