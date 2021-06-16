import axios, {AxiosInstance, AxiosStatic, Method} from 'axios';
import Config from 'react-native-config';

export class req1 {
  static post = (rout: string) => axios.create().post(httpBaseUrl)
}
type TToken = {
  token: string,
  expires: string
}
export const req = (token?: TToken): AxiosInstance => {

  const instance = axios.create({
    baseURL: Config.API_URL,
    headers: {token}
  });
  return instance;
};

