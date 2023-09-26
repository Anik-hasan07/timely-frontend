import { getTaskByProject } from './reducer';

export const getTasksByProject = (token) => async (dispatch) => {
  dispatch(getTaskByProject(token));
};
