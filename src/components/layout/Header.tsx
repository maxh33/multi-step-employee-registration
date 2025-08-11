import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';

interface HeaderProps {
  showBreadcrumbs?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showBreadcrumbs = false 
}) => {
  const theme = useTheme();


  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#f8f9fa',
          borderBottom: 'none',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          padding: theme.spacing(0, 3),
          minHeight: '64px',
        }}
      >
        {/* Empty space where breadcrumbs were */}
        <Box />

        {/* Right Side Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
          }}
        >
          {/* User Profile */}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: theme.palette.primary.main,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            M
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Max
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
    
    </>
  );
};

export default Header;