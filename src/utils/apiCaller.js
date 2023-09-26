import { apiEndpoint as api } from '../config/config';

// eslint-disable-next-line consistent-return
export const privateGet = async (endpoint, token) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', `application/json`);
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow',
  };

  const res = await fetch(`${api}/${endpoint}`, requestOptions);
  if (res.status === 200) {
    const resData = await res.json();
    return resData.data;
  }
  throw Error();
};

export const privatePatch = async (endpoint, token, body) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', `application/json`);
  const requestOptions = {
    method: 'PATCH',
    headers,
    redirect: 'follow',
    body: JSON.stringify(body),
  };
  const res = await fetch(`${api}/${endpoint}`, requestOptions);

  if (res.status === 200) {
    const resData = await res.json();
    return resData;
  }
  throw Error();
};
