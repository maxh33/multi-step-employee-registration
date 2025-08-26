import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  showBreadcrumbs?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBreadcrumbs: _showBreadcrumbs = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleUserMenuClose();
    await signOut();
    navigate('/login');
  };

  // Extract user display name from email
  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

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
          {' '}
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
            {/* User Profile Button */}
            <IconButton
              onClick={handleUserMenuClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(1),
                borderRadius: '8px',
                padding: theme.spacing(0.5, 1),
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {' '}
                {getUserDisplayName().charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                {getUserDisplayName()}
              </Typography>
            </IconButton>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {' '}
              <MenuItem disabled sx={{ opacity: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                {user?.email}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
