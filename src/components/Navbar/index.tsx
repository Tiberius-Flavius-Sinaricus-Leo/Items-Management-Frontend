import { type FunctionComponent } from 'react';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/AuthStore';

const Navbar: FunctionComponent = () => {

  const navigate = useNavigate();
  const handleDashboardClick = () => navigate('/');
  const handleCategoriesClick = () => navigate('/categories'); 
  const handleItemsClick = () => navigate('/items');
  const handleUsersClick = () => navigate('/users');
  const { logout, role } = useAuthStore();
  const isAdminAtLeast = role && (role === 'ROLE_ADMIN' || role === 'ROLE_ROOT');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Button color="inherit" sx={{ left: 0 }} onClick={handleDashboardClick}>
            Dashboard
          </Button>
          <Button color="inherit" sx={{ ml: 2 }} onClick={() => navigate('/explore')}>
            Explore
          </Button>
          <Button color="inherit" sx={{ ml: 2 }} onClick={handleCategoriesClick}>
            Manage Categories
          </Button>
          <Button color="inherit" sx={{ ml: 2 }} onClick={handleItemsClick}>
            Manage Items
          </Button>
          {isAdminAtLeast && (
            <Button color="inherit" sx={{ ml: 2 }} onClick={handleUsersClick}>
              Manage Users
            </Button>
          )}
          <Button color="inherit" sx={{ right: 0, marginLeft: "auto" }} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

