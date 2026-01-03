import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
  CssBaseline
} from '@mui/material';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Send, 
  ClipboardList, 
  LogOut, 
  Menu,
  ChevronLeft,
  Shield
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import config from '../../config';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/campaigns', icon: Send, label: 'Campaigns' },
  { path: '/templates', icon: FileText, label: 'Templates' },
  { path: '/persons', icon: Users, label: 'Persons' },
  { path: '/autoresponders', icon: MessageSquare, label: 'Autoresponders' },
  { path: '/audit', icon: ClipboardList, label: 'Audit Logs', adminOnly: true },
  { path: '/admin/users', icon: Shield, label: 'User Management', adminOnly: true },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    item => !item.adminOnly || user?.role === 'admin'
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'space-between' : 'center',
        minHeight: 64,
        borderBottom: 1, 
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <MessageSquare size={32} color={theme.palette.primary.main} />
          {open && (
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {config.appName}
            </Typography>
          )}
        </Box>
        {!isMobile && open && (
          <IconButton onClick={handleDrawerCollapse} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Nav Items */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                selected={isActive}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '& .lucide': { color: 'inherit' }
                  },
                  '&:hover': {
                    bgcolor: 'background.tertiary',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? 'inherit' : 'text.secondary'
                  }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} 
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ borderColor: 'divider' }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, justifyContent: open ? 'flex-start' : 'center' }}>
          <Avatar sx={{ 
            bgcolor: 'secondary.main', 
            width: 36, 
            height: 36, 
            fontSize: '0.9rem',
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          {open && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
          )}
        </Box>
        
        <ListItemButton 
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2, 
            justifyContent: open ? 'flex-start' : 'center',
            px: open ? 2 : 1,
            color: 'text.secondary',
            border: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'error.main',
              color: 'error.main',
              bgcolor: 'rgba(255, 107, 107, 0.1)'
            }
          }}
        >
          <LogOut size={20} />
          {open && <Typography sx={{ ml: 1.5, fontSize: '0.9rem' }}>Logout</Typography>}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)` },
          ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
          display: { sm: 'none' },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, mb: 0 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="text.primary">
            {config.appName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: open ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.2s' }}
        aria-label="mailbox folders"
      >
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: open ? drawerWidth : collapsedDrawerWidth,
              transition: 'width 0.2s',
              overflowX: 'hidden'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)` },
          mt: { xs: 7, sm: 0 },
          transition: 'width 0.2s'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
