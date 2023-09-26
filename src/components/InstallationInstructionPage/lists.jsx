import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import MovingIcon from '@mui/icons-material/Moving';

export default function AlignItemsList() {
  return (
    <List className="list_wrapper" sx={{ width: '100%' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <div className="list-icons">
            <RemoveRedEyeIcon />
          </div>
        </ListItemAvatar>
        <ListItemText primary="See everything in one place so you can effortlessly manage your team, projects, clients and freelancers." />
      </ListItem>

      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <div className="list-icons">
            <MovingIcon />
          </div>
        </ListItemAvatar>
        <ListItemText primary="See everything in one place so you can effortlessly manage your team, projects, clients and freelancers." />
      </ListItem>

      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <div className="list-icons">
            <HorizontalSplitIcon />
          </div>
        </ListItemAvatar>
        <ListItemText primary="See everything in one place so you can effortlessly manage your team, projects, clients and freelancers." />
      </ListItem>
    </List>
  );
}
