import axios from 'axios';

export const listFiles = async (accessToken:string, folderId: string) => {
  const res = await axios.request({
    url: 'https://www.googleapis.com/drive/v3/files',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    method: 'GET',
    params: {q: `'${folderId}' in parents and trashed=false`},
  });
  return res.data?.files;
};
