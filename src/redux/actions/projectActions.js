import { getProjects as getProjectsData } from '../reducers/projectReducer';

export const getProjects = (token) => async (dispatch) => {
  dispatch(getProjectsData(token));
};
