import axios from 'axios';

export const getFile = async (accessToken:string, name: string) => {
  const res = await axios.request({
    url: 'https://www.googleapis.com/drive/v3/files',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    method: 'GET',
    params: {q: `name='${name}' and trashed=false`},
  }).catch((e)=>{
      console.log(e)
  });

  return res && res?.data && res.data?.files?.length && res.data.files[0];
};
