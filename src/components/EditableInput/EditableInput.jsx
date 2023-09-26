import { CheckOutlined, Clear } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const EditableInput = ({ typographyStyle, text, updatedText }) => {
  const [inputText, setInputText] = useState('');
  const [istextFIledFocus, setIsTextFIledFocus] = useState(false);
  const handelEditAble = () => {
    setIsTextFIledFocus(true);
  };

  const handelSave = () => {
    updatedText(inputText);
    setIsTextFIledFocus(false);
  };

  useEffect(() => {
    setInputText(text);
  }, [text]);

  return (
    <Box>
      {!istextFIledFocus ? (
        <Typography
          p="15px"
          sx={{ '&:hover': { background: '#ebecf0' } }}
          border="1px solid transparent"
          onClick={handelEditAble}
          {...typographyStyle}
        >
          {inputText}
        </Typography>
      ) : (
        <Box sx={{ position: 'relative', transition: 'all 0.5s ease' }}>
          <TextField
            multiline
            autoFocus
            inputProps={{
              style: {
                fontSize: typographyStyle.fontSize,
                fontWeight: typographyStyle.fontWeight,
                padding: '9px 0px',
                lineHeight: '1.167',
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: typographyStyle.fontSize,
                fontWeight: typographyStyle.fontWeight,
                lineHeight: '1.167',
              },
            }}
            value={inputText}
            size="small"
            fullWidth
            onChange={(event) => setInputText(event.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
            onBlur={() =>
              setTimeout(() => {
                setIsTextFIledFocus(false);
              }, 100)
            }
            onKeyUp={(event) => event.key === 'Enter' && handelSave()}
          />

          <Box sx={{ position: 'absolute', right: 0, zIndex: 1 }} textAlign="right">
            <IconButton
              sx={{ boxShadow: 2, borderRadius: '5px', margin: '2px' }}
              aria-label="save"
              size="small"
              onClick={handelSave}
            >
              <CheckOutlined fontSize="inherit" />
            </IconButton>

            <IconButton
              sx={{ boxShadow: 2, borderRadius: '5px', margin: '2px' }}
              aria-label="save"
              size="small"
              onClick={() => {
                setIsTextFIledFocus(false);
                setInputText(text.replace(/(\r\n|\n|\r)/gm, ''));
              }}
            >
              <Clear fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditableInput;
