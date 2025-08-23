import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Drawer,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  width: number;
  onNavigateHome?: () => void;
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  width,
  onNavigateHome,
  variant = 'permanent',
  open = true,
  onClose,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'colaboradores',
      label: 'Colaboradores',
      icon: <PeopleIcon />,
      path: '/colaboradores',
    },
    {
      id: 'departamentos',
      label: 'Departamentos',
      icon: <BusinessIcon />,
      path: '/departamentos',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#212529',
          borderRight: `1px solid #e9ecef`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: theme.spacing(2, 0),
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            padding: theme.spacing(2, 3),
            marginBottom: theme.spacing(2),
          }}
        >
          <Box
            onClick={() => {
              window.open('https://maxhaider.dev/en/', '_blank', 'noopener,noreferrer');
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(1),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <img
              src="/favicon.svg"
              alt="Max Logo"
              style={{
                height: '24px',
                width: 'auto',
                // Logo is already black for white background
              }}
            />
            <Typography
              variant="h6"
              sx={{
                marginLeft: theme.spacing(2),
                fontWeight: 600,
                color: '#212529',
                fontSize: '1.1rem',
                textDecoration: 'none',
              }}
            >
              Max Haider
            </Typography>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ padding: 0, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (onClose) onClose();
                  }}
                  sx={{
                    padding: theme.spacing(1.5, 3),
                    backgroundColor: active ? 'rgba(0, 200, 81, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    borderRadius: 0,
                    cursor: 'pointer',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? theme.palette.primary.main : '#6c757d',
                      minWidth: '32px',
                      marginRight: theme.spacing(1),
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: active ? 500 : 400,
                      color: active ? '#212529' : '#6c757d',
                    }}
                  />
                  {active && (
                    <ChevronRightIcon
                      sx={{
                        fontSize: '18px',
                        color: theme.palette.primary.main,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
