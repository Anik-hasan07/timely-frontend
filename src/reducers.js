import { combineReducers } from 'redux';
import projectUserReducer from './pages/AllProjects/ProjectSettings/reducer';
import taskByProjectReducers from './pages/ProjectDetails/reducer';
import { apiSlice } from './redux/api/apiSlice';
import backlog from './redux/backlog/backLogSlice';
import { userApi } from './redux/reducers/apiReducer';
import projectReducer from './redux/reducers/projectReducer';
import sprintReducer from './redux/reducers/sprintReducer';
import userReducer from './redux/reducers/userReducer';

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  userReducer,
  projectReducer,
  taskByProjectReducers,
  projectUserReducer,
  [userApi.reducerPath]: userApi.reducer,
  backlog: backlog.reducer,
  sprintReducer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};
export default rootReducer;
