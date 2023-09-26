import * as React from 'react';
import Popper from '@mui/material/Popper';
import {
  Box,
  Stack,
  MenuList,
  MenuItem,
  Paper,
  Grow,
  ClickAwayListener,
  Button,
  ButtonGroup,
} from '@mui/material';
import { AttachFile, TaskOutlined, ArrowDropDown } from '@mui/icons-material';

const btn_styles = {
  boxShadow: 'none',
  borderColor: 'gray',
  color: 'black',
  textTransform: 'none',
  background: 'rgba(9,30,66,0.04)',
  fontWeight: '600',
  ':hover': {
    background: 'lightgray',
  },
};

const options = ['Link issue', 'Link confluence page', 'Add web link'];

export function DetailsButtons() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack direction="row" gap={1}>
      <Button startIcon={<AttachFile />} sx={btn_styles} size="small">
        Attach
      </Button>
      <Button startIcon={<TaskOutlined />} sx={btn_styles} size="small">
        Create Subtask
      </Button>

      <Box>
        <ButtonGroup sx={btn_styles} variant="contained" ref={anchorRef} aria-label="split button">
          <Button size="small" style={btn_styles} onClick={handleClick}>
            {options[selectedIndex]}
          </Button>
          <Button
            style={btn_styles}
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDown />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        style={btn_styles}
                        key={option}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Stack>
  );
}
