import { Avatar, Box, Stack, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export function Comment({ avatarSrc = '' }) {
  const [isShowingEditView, setIsShowingEditView] = useState(false);
  const [commentHtml, setCommentHtml] = useState('<p>Test comment</p>');
  const [editedTemporaryComment, setEditedTemporaryComment] = useState(commentHtml);

  const toggleEditView = () => setIsShowingEditView(!isShowingEditView);
  const saveComment = () => {
    setCommentHtml(editedTemporaryComment);
    toggleEditView();
  };

  return (
    <Stack direction="row" spacing={1}>
      <Box pt={1}>
        <Avatar src={avatarSrc}></Avatar>
      </Box>
      {isShowingEditView ? (
        <Box>
          <CKEditor
            editor={ClassicEditor}
            data={commentHtml}
            onChange={(_, editor) => {
              setEditedTemporaryComment(editor.getData());
            }}
          />
          <Stack mt={1} direction="row" spacing={2}>
            <Button size="small" variant="contained" onClick={saveComment}>
              Save
            </Button>
            <Button size="small" onClick={toggleEditView}>
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box width="100%">
          <TextField mb={1} fullWidth label="Add a comment" id="comment" onClick={toggleEditView} />
          <Box style={{ marginTop: '5px' }}>
            <Typography fontSize={12} color="gray" variant="p">
              Pro tip: press <b>M</b> to comment
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
