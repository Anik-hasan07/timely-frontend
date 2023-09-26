import { ExpandMore } from '@mui/icons-material';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roles } from '../../../config/config';
import InviteMember from '../../../pages/InviteMember/InviteMember';
import {
  toggleIsCreateProjectModalOpen,
  toggleisInviteProjectUserModalOpen,
} from '../../../redux/reducers/projectReducer';
import ConditionalLink from './ConditionalLink';

const MenuWithSubMenu = ({ item, type, ...rest }) => {
  const [anchorElSubMenu, setAnchorElSubMenu] = useState(null);
  const dispatch = useDispatch();
  const handleSubMenuOpen = (event) => {
    setAnchorElSubMenu(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setAnchorElSubMenu(null);
  };

  const [selectedModal, setSelectedModal] = useState('');
  const dispatchIsCreateProjectModalOpen = () => dispatch(toggleIsCreateProjectModalOpen());
  const dispatchtoggleisInviteProjectUserModalOpen = (_, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    dispatch(toggleisInviteProjectUserModalOpen());
  };
  // eslint-disable-next-line no-shadow
  const handleSubMenuClick = (item) => {
    handleSubMenuClose();
    if (item?.modal === 'createProject') {
      setSelectedModal(item?.modal);
      dispatchIsCreateProjectModalOpen();
    }
    if (item?.modal === 'inviteMember') {
      setSelectedModal(item?.modal);
      dispatchtoggleisInviteProjectUserModalOpen();
    }
  };
  const { projectReducer } = useSelector((state) => state);
  const { userReducer } = useSelector((state) => state);
  const userRole = userReducer.userData?.role;

  return (
    <ConditionalLink condition={item?.link} linkTo={item?.link}>
      {type === 'list' ? (
        <MenuItem {...rest}>
          <Typography color="black" textAlign="center">
            {item?.title}
          </Typography>
          {item.subMenu && <ExpandMore sx={{ color: 'gray' }} />}
        </MenuItem>
      ) : (
        <Button
          key={item.title}
          onClick={handleSubMenuOpen}
          sx={{
            my: 2,
            color: 'black',
            display: 'flex',
            textTransform: 'none',
          }}
        >
          {item.title}
          {item.subMenu && <ExpandMore sx={{ color: 'gray' }} />}
        </Button>
      )}
      {item?.subMenu && (
        <Menu
          id="subMenu-appbar"
          anchorEl={anchorElSubMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElSubMenu)}
          onClose={handleSubMenuClose}
        >
          {item?.subMenu.map((subItem) => {
            const shouldRender =
              userRole === roles.admin ||
              userRole === roles.superAdmin ||
              (subItem.modal !== 'createProject' && subItem.modal !== 'inviteMember');

            return (
              shouldRender && (
                <ConditionalLink
                  condition={subItem?.link}
                  linkTo={subItem?.link}
                  key={subItem.title}
                >
                  <MenuItem onClick={() => handleSubMenuClick(subItem)}>
                    <Typography color="black" textAlign="center">
                      {subItem.title}
                    </Typography>
                  </MenuItem>
                </ConditionalLink>
              )
            );
          })}
        </Menu>
      )}
      {selectedModal && selectedModal === 'inviteMember' && (
        <InviteMember
          isModalOpen={projectReducer?.isInviteProjectUserModalOpen}
          handleClickClose={dispatchtoggleisInviteProjectUserModalOpen}
        />
      )}
    </ConditionalLink>
  );
};

export default MenuWithSubMenu;
