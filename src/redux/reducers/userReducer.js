import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getUser = createAsyncThunk('getUser', async (token, { rejectWithValue }) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user`, requestOptions);

    if (res.status === 200) return (await res.json()).data;
    throw Error();
  } catch (error) {
    return rejectWithValue('Error at fetching user details');
  }
});

export const getUserById = createAsyncThunk('getUserById', async (data, { rejectWithValue }) => {
  try {
    const { userId, token } = data;
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user/${userId}`, requestOptions);

    if (res.status === 200) return (await res.json()).data;
    throw Error();
  } catch (error) {
    return rejectWithValue('Error at fetching user details');
  }
});

// eslint-disable-next-line consistent-return
export const getToken = createAsyncThunk('getToken', async (data, { rejectWithValue }) => {
  try {
    const { userId, orgId, userName, orgName, userEmail, projectId } = data;
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const res = await fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/token?userId=${userId}&orgId=${orgId}&userName=${userName}&orgName=${orgName}&userEmail=${userEmail}${
        projectId ? `&projectId=${projectId}` : ''
      }`,
      requestOptions
    );

    if (res.status === 200) return (await res.json()).data;
  } catch (error) {
    return rejectWithValue('Error at fetching token');
  }
});

const initialState = {
  isFetchingToken: false,
  isFetchingTokenFinished: false,
  token: '',
  isFetchingUserData: false,
  isFetchingUserDetails: false,
  isFetchingError: false,
  errorMsg: null,
  userData: {},
  userDetails: null,
};

export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  extraReducers: {
    [getUser.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingUserData = true;
    },
    [getUser.fulfilled]: (state, { payload }) => {
      state.isFetchingUserData = false;
      state.userData = payload;
    },
    [getUser.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingUserData = false;
      state.userData = null;
    },
    [getUserById.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingUserDetails = true;
    },
    [getUserById.fulfilled]: (state, { payload }) => {
      state.isFetchingUserDetails = false;
      state.userDetails = payload?.user;
    },
    [getUserById.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingUserDetails = false;
      state.userDetails = null;
    },
    [getToken.pending]: (state) => {
      state.errorMsg = null;
      state.isFetchingError = false;
      state.isFetchingToken = true;
      state.isFetchingTokenFinished = false;
    },
    [getToken.fulfilled]: (state, { payload }) => {
      state.isFetchingToken = false;
      state.token = payload?.token;
      state.isFetchingTokenFinished = true;
    },
    [getToken.rejected]: (state, action) => {
      state.isFetchingError = true;
      state.errorMsg = action.payload;
      state.isFetchingToken = false;
      state.isFetchingTokenFinished = true;
      state.token = null;
    },
  },

  reducers: {
    logoutUser: (state) => {
      state.userData = { ...initialState };
    },
    resetUser: (state) => {
      state.isFetchingToken = false;
      state.isFetchingTokenFinished = false;
      state.token = '';
      state.isFetchingUserData = false;
      state.isFetchingError = false;
      state.errorMsg = null;
      state.userData = {};
    },
  },
});

export const { resetUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
