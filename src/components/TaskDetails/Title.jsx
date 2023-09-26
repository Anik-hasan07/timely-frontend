import { CheckOutlined, Clear } from '@mui/icons-material';
import { Stack, Typography, TextField, Box, IconButton } from '@mui/material';
import { useState } from 'react';

const iconBtnStyle = {
  background: 'rgba(9, 30, 66, 0.04)',
  borderRadius: '5px',
  ':hover': { background: 'lightgray' },
};

export function TaskTitle({ title }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [temporaryTitle, setTemporaryTitle] = useState(updatedTitle);

  const toggleEditingState = (value) =>
    setIsEditing(typeof value === 'boolean' ? value : !isEditing);
  const titleOnChange = (e) => setTemporaryTitle(e.currentTarget.value);
  const submitTitle = () => {
    setUpdatedTitle(temporaryTitle);
    toggleEditingState(false);
  };
  const cancelSubmit = () => {
    setTemporaryTitle(updatedTitle);
    toggleEditingState(false);
  };
  return (
    <Box width="100%" mb={1} mt={1} p={1}>
      {isEditing ? (
        <Box position="relative">
          <TextField fullWidth value={temporaryTitle} onChange={titleOnChange}></TextField>
          <Stack direction="row" position="absolute" right="0px" bottom="-45px" spacing={1}>
            <IconButton size="small" sx={iconBtnStyle} onClick={submitTitle}>
              <CheckOutlined />
            </IconButton>
            <IconButton onClick={cancelSubmit} size="small" sx={iconBtnStyle}>
              <Clear />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <div onDoubleClick={toggleEditingState}>
          <Typography mt={1} mb={1} variant="h5" sx={{ ':hover': { background: '#8080801f' } }}>
            {updatedTitle}
          </Typography>
        </div>
      )}
    </Box>
  );
}
