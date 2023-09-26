import { getUser } from '../reducers/userReducer';

export const getUserData = (token) => async (dispatch) => {
  dispatch(getUser(token));
};
