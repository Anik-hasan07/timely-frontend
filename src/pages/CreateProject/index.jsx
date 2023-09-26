import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useCreateProjectMutation, useGetProjectsQuery } from '../../redux/api/apiSlice';
import { getProjects } from '../../redux/reducers/projectReducer';

export const createProjectValidationSchema = yup.object({
  projectName: yup.string().trim().required('Project name is required'),
  projectPrefix: yup.string().trim().required('Project prefix is required'),
  boardType: yup.string().trim().required('Board type is required'),
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function CreateProject({ isModalOpen, handleClickClose }) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProjectValidationSchema),
  });
  const { userReducer } = useSelector((state) => state);
  const [checkUnique, setCheckUnique] = useState();
  const [prefix, setPrefix] = useState('');
  const [projectNameError, setProjectNameError] = useState('');
  const [createProject, { isLoading, error, isError }] = useCreateProjectMutation();
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      if (values.projectName.length < 3) {
        setProjectNameError('At least 3 characters are required');
        return;
      }
      const payload = await createProject(values).unwrap();
      if (payload?.data?.projectId) {
        reset({ projectName: '', boardType: '', projectPrefix: '' });
        setPrefix('');
        reset({});
        handleClickClose();
        await dispatch(getProjects(userReducer.token));
        navigate('/Projects');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const errorMsg = isError ? error?.data?.message?.title || error?.data?.message : null;
  const previousProjects = projects?.data?.projects;
  const generateProjectPrefix = (projectName) => {
    const allPreviousProjectPrefix = previousProjects?.map(({ projectPrefix }) => projectPrefix);
    const currentPrefix = projectName.replaceAll(' ', '').slice(0, 3) || prefix;
    const isPrefixIncluded = allPreviousProjectPrefix?.includes(currentPrefix.toUpperCase());
    setCheckUnique(isPrefixIncluded);
    return currentPrefix.toUpperCase();
  };
  useEffect(() => {
    const allPreviousProjectPrefix = previousProjects?.map(({ projectPrefix }) => projectPrefix);
    const isPrefixIncluded = allPreviousProjectPrefix?.includes(prefix);
    setCheckUnique(isPrefixIncluded);
    setValue('projectPrefix', prefix);
  }, [prefix]);

  return (
    <Dialog
      open={isModalOpen}
      className="issueCreateDialog"
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClickClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dialogHeader">
          <div>Create Project</div>
          <ClearIcon onClick={handleClickClose} style={{ cursor: 'pointer' }} />
        </div>
        <DialogContent
          sx={{
            minHeight: 200,
          }}
        >
          <Grid width="90%">
            <Grid item xs={6} md={6}>
              <Grid item xs={12}>
                <Controller
                  name="projectName"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      disabled={isLoading}
                      onFocus={() => setProjectNameError(null)}
                      onChange={(e) => {
                        try {
                          const projectName = e.currentTarget.value;

                          const projectPrefix = generateProjectPrefix(projectName);
                          onChange(e);
                          setValue('projectPrefix', projectPrefix);
                          setPrefix(projectPrefix);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      label="Project Name"
                      error={!!errors.projectName}
                      helperText={errors.projectName ? errors.projectName.message : null}
                    />
                  )}
                />
                <Typography sx={{ mt: '5px', fontSize: '12px' }} color="error">
                  {projectNameError}
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Controller
                  name="boardType"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <FormControl fullWidth>
                      <InputLabel>Board Type</InputLabel>
                      <Select
                        disabled={isLoading}
                        fullWidth
                        value={value}
                        label="Board Type"
                        onChange={onChange}
                        error={!!errors.boardType}
                      >
                        <MenuItem value="kanban">Kanban</MenuItem>
                        <MenuItem value="scrum">Scrum</MenuItem>
                      </Select>
                      {errors.boardType && (
                        <FormHelperText error={!!errors.boardType}>
                          {errors.boardType ? errors.boardType.message : null}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} mt={2}>
                <Controller
                  name="projectPrefix"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      value={prefix}
                      disabled={isLoading}
                      onChange={(e) => {
                        setPrefix(e.target.value.toUpperCase());
                      }}
                      label="Project Prefix"
                      error={!!errors.projectPrefix}
                      helperText={errors.projectPrefix ? errors.projectPrefix.message : null}
                    />
                  )}
                />
                {((prefix.length < 3 && prefix) || prefix.length > 3) && (
                  <Typography sx={{ mt: '5px', fontSize: '12px' }} color="error">
                    At least 3 characters and at most 3 characters are required.
                  </Typography>
                )}
                {checkUnique && (
                  <Typography color="error" sx={{ mt: '5px', fontSize: '12px' }}>
                    Duplicate project prefix!
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <div>
          <DialogActions>
            <Button onClick={handleClickClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={checkUnique || prefix.length !== 3}
              sx={{
                height: '100%',
                alignSelf: 'center',
                ml: 2,
                textTransform: 'none',
                display: { xs: 'none', md: 'block' },
              }}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
}
