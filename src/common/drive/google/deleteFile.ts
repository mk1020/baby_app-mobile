import axios from 'axios';

export const deleteFile = async (accessToken:string, id: string) => {
  const res = await axios.request({
    url: `https://www.googleapis.com/drive/v3/files/${id}`,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
  });
  if (!res.data) {
    return true;
  } else {
    return false;
  }
};
