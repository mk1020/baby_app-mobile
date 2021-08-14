import axios from 'axios';
import {LoadType} from './uploadGoogle2';

export const createFolder = async (accessToken: string, name: string) => {
  const res = await axios.request({
    url: 'https://www.googleapis.com/drive/v3/files',
    data: {name, mimeType: 'application/vnd.google-apps.folder'},
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    method: 'POST'
  });
  return res;
};
