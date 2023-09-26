import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import createExpirationTransform from 'redux-persist-transform-expire';
import storage from 'redux-persist/lib/storage';
import { environment } from './config/config';
import rootReducer from './reducers';
import { apiSlice } from './redux/api/apiSlice';
import { userApi } from './redux/reducers/apiReducer';

const middlewares = [userApi.middleware, apiSlice.middleware];
const loggerEnvs = ['dev'];
if (loggerEnvs.includes(environment)) {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
  });
  middlewares.push(logger);
}
const expireTransform = createExpirationTransform({ expireKey: 'expiresAt' });
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userReducer'],
  transforms: [expireTransform],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),

  devTools: environment === 'dev',
});
const persistor = persistStore(store);
export { persistor, store };
// eslint-disable-next-line prettier/prettier
