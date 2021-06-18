import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosStatic, Method} from 'axios';
import Config from 'react-native-config';
import {Dispatch} from 'redux';
import {refreshToken} from '../../redux/appSlice';
import {TToken} from '../../redux/types';

type TRoutesWithoutUpdateToken = string[];

const msInDay = 86400000;
const isNeedUpdate = (token?: TToken) => {
  if (token) {
    const expires = new Date(token.expires).getTime();
    const curDate = new Date().getTime();
    if (expires - curDate > msInDay * 7) {
      return true;
    } else {
      return false;
    }
  }
};
const updateToken = (token: TToken, dispatch: Dispatch) => {
  axios.post(`${Config.API_URL}/token`, {}, {headers: {token: token.token}})
    .then(res => {
      console.log('upres', res);
      dispatch(refreshToken(res.data));
    })
    .catch((err: AxiosError) => {
      console.log(err.response);
    });
};
export const req = (token: TToken | null, dispatch?: Dispatch): AxiosInstance => {
  const inst = axios.create({
    baseURL:  Config.API_URL,
    headers: {token: token?.token}
  });

  if (token && dispatch) {
    const excludeFromUpdates = ['/signOut', '/signin', 'signup', '/users/password', '/password-reset'];
    inst.interceptors.request.use((config): AxiosRequestConfig => {
      if (!excludeFromUpdates.includes(config.url!)) {
        console.log('includes');
        isNeedUpdate(token) && updateToken(token, dispatch);
      }
      return config;
    });
  }

  return inst;
};

