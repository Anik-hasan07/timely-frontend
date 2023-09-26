import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Typography } from '@mui/material';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import './EditableDescription.scss';

const EditableDescription = ({ data, updatedData }) => {
  const [editorData, setEditorData] = useState('');
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const handelSave = () => {
    updatedData(editorData);
    setIsOpenEdit(false);
  };
  const placeholderText = 'Add a description...';

  useEffect(() => {
    setEditorData(data);
  }, [data]);

  return (
    <Box>
      <Typography p="0 15px" variant="subtitle1" fontWeight="600">
        Description
      </Typography>

      {!isOpenEdit ? (
        <Box
          onClick={() => setIsOpenEdit(true)}
          p="5px 15px"
          className="descriptionWrapper"
          sx={{
            '&:hover': { background: '#e6e6e6', borderRadius: '5px' },
            color: '#5e6c84',
            borderRadius: '3px',
            fontSize: '16px',
          }}
        >
          {editorData ? (
            parse(editorData)
          ) : (
            <Typography color="rgb(128, 128, 128)">{placeholderText}</Typography>
          )}
        </Box>
      ) : (
        <Box p="15px">
          <CKEditor
            editor={ClassicEditor}
            // config={editorConfig}
            data={editorData}
            // onReady={(editor) => {
            //   // You can store the "editor" and use when it is needed.
            //   console.log('Editor is ready to use!', editor);
            // }}
            onChange={(event, editor) => {
              setEditorData(editor.getData());
            }}
            // onBlur={(event, editor) => {
            //   console.log('Blur.', editor);
            // }}
            // onFocus={(event, editor) => {
            //   console.log('Focus.', editor);
            // }}
          />
          <Box mt={1}>
            <Button
              sx={{ textTransform: 'capitalize', marginRight: '8px' }}
              size="medium"
              variant="contained"
              disableElevation
              onClick={handelSave}
            >
              Save
            </Button>

            <Button
              onClick={() => {
                setIsOpenEdit(false);
                setEditorData(data);
              }}
              sx={{ textTransform: 'capitalize' }}
              size="medium"
              variant="text"
              disableElevation
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditableDescription;
