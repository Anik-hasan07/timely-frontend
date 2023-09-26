import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import './style.scss';

const Modal = ({
  open,
  setOpen,
  title,
  submitText,
  handleSubmit,
  children,
  closeBtnSx = {},
  submitBtnSx = {},
  ...rest
}) => {
  const handleClose = (_, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      id="modal-primary"
      {...rest}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {children && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} sx={closeBtnSx}>
          Close
        </Button>
        {submitText && (
          <Button variant="contained" onClick={handleSubmit} sx={submitBtnSx} autoFocus>
            {submitText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
