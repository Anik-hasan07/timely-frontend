import AddCardIcon from '@mui/icons-material/AddCard';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BentoIcon from '@mui/icons-material/Bento';
import BugReportIcon from '@mui/icons-material/BugReport';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import PatternIcon from '@mui/icons-material/Pattern';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { boardTypes, roles } from '../../config/config';
import { kanbanLeftMenuList, leftBottom, scrumLeftMenuList } from '../../utils/menu';
import Navbar from '../Navbar';
import DropDown from './DropDown';
import './LeftSidebar.scss';

// Genarate icons for list items
function genarateIcon(text) {
  if (text === 'Roadmap') {
    return <EditRoadIcon />;
  }
  if (text === 'Backlog') {
    return <PatternIcon />;
  }
  if (text === 'Active sprint') {
    return <CalendarViewWeekIcon />;
  }
  if (text === 'Kanban board') {
    return <CalendarViewWeekIcon />;
  }
  if (text === 'Reports') {
    return <AutoGraphIcon />;
  }
  if (text === 'Issues') {
    return <BugReportIcon />;
  }
  if (text === 'Components') {
    return <BentoIcon />;
  }
  if (text === 'Project pages') {
    return <DescriptionIcon />;
  }
  if (text === 'Add shortcut') {
    return <AddCardIcon />;
  }
  if (text === 'Project settings') {
    return <SettingsIcon />;
  }
  if (text === 'Members') {
    return <PeopleIcon />;
  }
  return null;
}

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children }) {
  const navigate = useNavigate();

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { projectReducer } = useSelector((state) => state);
  const [leftSidebarMenuList, setLeftSidebarMenuList] = React.useState([]);
  const boardType = projectReducer?.selectedProject?.boardType;
  const { userReducer } = useSelector((state) => state);
  const userRole = userReducer.userData?.role;

  useEffect(() => {
    if (boardType === boardTypes.scrum) {
      setLeftSidebarMenuList(scrumLeftMenuList);
    } else {
      setLeftSidebarMenuList(kanbanLeftMenuList);
    }
  }, [boardType]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const path = window.location.pathname;
  const [selectedItem, setSelectedItem] = React.useState(path);
  useEffect(() => {
    setSelectedItem(path);
  }, [path]);

  const handleMenuClick = (link) => {
    const processedLink = link.replace(':projectId', projectReducer?.selectedProject?.projectId);
    navigate(processedLink);
    setSelectedItem(processedLink);
  };
  const handleLeftBottomClick = (link) => {
    const processedLink = link.replace(':projectId', projectReducer?.selectedProject?.projectId);
    setSelectedItem(processedLink);
    navigate(processedLink);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar className="left_sidebar__header" position="fixed" open={open}>
        <Navbar />
        <Toolbar className="hamburger__container">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader className="left_sidebar__header">
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List className="left_sidebar_list with_dropdown">
          <ListItem sx={{ ...(!open && { display: 'none' }) }}>
            <DropDown />
          </ListItem>

          <Divider
            sx={{ ...(!open && { marginBottom: '55px' }), ...(open && { display: 'none' }) }}
          />
          {leftSidebarMenuList?.map((item) => (
            <ListItem
              onClick={() => handleMenuClick(item.link)}
              className="left_sidebar_list--item"
              key={item.title}
              disablePadding
              sx={{
                display: 'block',
                backgroundColor:
                  selectedItem ===
                  item?.link.replace(':projectId', projectReducer?.selectedProject?.projectId)
                    ? '#FFF6F4'
                    : '',
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  className="left_sidebar_list--icon"
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {genarateIcon(item.title)}
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          {leftBottom.map((item) => {
            const shouldRender =
              userRole === roles.admin ||
              userRole === roles.superAdmin ||
              item.title !== 'Project settings';
            return (
              shouldRender && (
                <ListItem
                  key={item.title}
                  onClick={() => handleLeftBottomClick(item.link)}
                  disablePadding
                  sx={{
                    display: 'block',
                    backgroundColor:
                      selectedItem ===
                      item?.link.replace(':projectId', projectReducer?.selectedProject?.projectId)
                        ? '#FFF6F4'
                        : '',
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {genarateIcon(item.title)}
                      {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              )
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
