import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export function Description({ defaultDescription }) {
  const [isShowingEditView, setIsShowingEditView] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [editedTemporaryDescription, setEditedTemporaryDescription] = useState(descriptionHtml);
  const toggleEditView = () => setIsShowingEditView(!isShowingEditView);
  const saveDescription = () => {
    setDescriptionHtml(editedTemporaryDescription);
    toggleEditView();
  };

  useEffect(() => {
    setDescriptionHtml(defaultDescription);
  }, [defaultDescription]);

  return (
    <Stack mt={2} mb={6} p={1}>
      <Typography fontWeight="bold" variant="p">
        Description
      </Typography>

      {isShowingEditView ? (
        <Box>
          <CKEditor
            editor={ClassicEditor}
            data={descriptionHtml}
            onChange={(_, editor) => {
              setEditedTemporaryDescription(editor.getData());
            }}
          />
          <Stack mt={1} direction="row" spacing={2}>
            <Button size="small" variant="contained" onClick={saveDescription}>
              Save
            </Button>
            <Button size="small" onClick={toggleEditView}>
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          paddingY={1}
          sx={{ ':hover': { background: '#8080801f' } }}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          onDoubleClick={toggleEditView}
        />
      )}
    </Stack>
  );
}
