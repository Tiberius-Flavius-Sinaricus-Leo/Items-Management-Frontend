import { type FunctionComponent, type MouseEvent, useState } from 'react';
import { AppBar, Box, Toolbar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Dashboard, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/AuthStore';

const Navbar: FunctionComponent = () => {

  const [anchorDropdown, setAnchorDropdown] = useState<null | HTMLElement>(null);
  const { logout, role } = useAuthStore();
  const isAdminOrRoot = role && (role === 'ROLE_ADMIN' || role === 'ROLE_ROOT');

  const navigate = useNavigate();
  const handleDashboardClick = () => navigate('/');
  const handleExploreClick = () => navigate('/explore');
  const handleCategoriesClick = () => navigate('/categories');
  const handleItemsClick = () => navigate('/items');
  const handleUsersClick = () => navigate('/users');
  const openDropdown = (event: MouseEvent<HTMLElement>) => {
    setAnchorDropdown(event.currentTarget);
  }
  const closeDropdown = () => {
    setAnchorDropdown(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Box
            id="navbar-buttons-container-normal"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Button color="inherit" sx={{ left: 0 }} onClick={handleDashboardClick}>
              Dashboard
            </Button>
            <Button color="inherit" sx={{ ml: 2 }} onClick={handleExploreClick}>
              Explore
            </Button>
            <Button color="inherit" sx={{ ml: 2 }} onClick={handleCategoriesClick}>
              Manage Categories
            </Button>
            <Button color="inherit" sx={{ ml: 2 }} onClick={handleItemsClick}>
              Manage Items
            </Button>
            {isAdminOrRoot && (
              <Button color="inherit" sx={{ ml: 2 }} onClick={handleUsersClick}>
                Manage Users
              </Button>
            )}
          </Box>
          {/* To put the logout button to the right end of the toolbar in the desktop view */}
          <Button color="inherit" sx={{ marginLeft: "auto", display: { xs: 'none', md: 'block' } }} onClick={logout}>
            Logout
          </Button>
          <Box
            id="navbar-buttons-container-small"
            sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: 'auto' }}
          >
            <IconButton
              onClick={openDropdown}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="navbar-dropdown-menu"
              anchorEl={anchorDropdown}
              open={Boolean(anchorDropdown)}
              onClose={closeDropdown}
            >
              <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
              <MenuItem onClick={handleExploreClick}>Explore</MenuItem>
              <MenuItem onClick={handleCategoriesClick}>Manage Categories</MenuItem>
              <MenuItem onClick={handleItemsClick}>Manage Items</MenuItem>
              {isAdminOrRoot && (
                <MenuItem onClick={handleUsersClick}>Manage Users</MenuItem>
              )}
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

