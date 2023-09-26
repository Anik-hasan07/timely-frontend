import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import timelyLogo from '../../assets/timely-logo.png';
import { roles } from '../../config/config';
import { stringAvatar } from '../../utils';
import { menuList } from '../../utils/menu';
import { CreateTask } from '../CreateTask/CreateTask';
import SearchComponent from '../searchComponent/SearchComponent';
import './Navbar.scss';
import MenuWithSubMenu from './components/MenuWithSubMenu';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [settings, setSettings] = useState([]);
  const { userReducer } = useSelector((state) => state);
  const userName = userReducer.userData?.userName;
  const userRole = userReducer.userData?.role;
  const userId = userReducer.userData?.userId;
  const navigate = useNavigate();
  const userNameCapitalFormation = userName?.toUpperCase();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  useEffect(() => {
    setSettings((prevSettings) => {
      const updatedSettings = [userName, ...prevSettings];
      return updatedSettings;
    });
  }, [userName]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleCreateTaskModal = () => {
    setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
  };

  const handleSettingClick = (setting) => {
    if (setting === userName) {
      handleCloseUserMenu();
      navigate(`/users/${userId}`);
    }
  };

  return (
    <AppBar position="static" color="transparent" className="appBar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img alt="" className="logoWeb" src={timelyLogo} />
          </Box>
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              Timely
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {menuList.map((menu) => (
                <MenuWithSubMenu
                  key={menu?.title}
                  item={menu}
                  type="list"
                  onClick={handleCloseNavMenu}
                />
              ))}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                }}
              >
                <SearchComponent />
              </Box>
              <Button variant="contained" sx={{ ml: 1 }}>
                Create
              </Button>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <img alt="" className="logoMobile" src={timelyLogo} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Timely
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {menuList.map((menu) => (
              <MenuWithSubMenu key={menu?.title} item={menu} />
            ))}
            {userRole === roles.admin || userRole === roles.superAdmin ? (
              <Button
                variant="contained"
                sx={{
                  height: '100%',
                  alignSelf: 'center',
                  ml: 2,
                  textTransform: 'none',
                  display: { xs: 'none', md: 'block' },
                }}
                onClick={toggleCreateTaskModal}
              >
                Create
              </Button>
            ) : null}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex' }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
              }}
            >
              {/* <SearchComponent /> */}
            </Box>
            {/* <IconButton size="large" aria-label="notifications" color="inherit">
              <NotificationsIcon />
            </IconButton> */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(userNameCapitalFormation)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={index} onClick={() => handleSettingClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
        <CreateTask isOpen={isCreateTaskModalOpen} handleClickClose={toggleCreateTaskModal} />
      </Container>
    </AppBar>
  );
}
export default Navbar;
