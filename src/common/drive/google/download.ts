import axios from 'axios';
import {downloadFile, TemporaryDirectoryPath} from 'react-native-fs';

export const download = async (accessToken:string, fileId: string, fileName: string) => {
  const res = await downloadFile({
    fromUrl: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    toFile: TemporaryDirectoryPath + '/' + fileName,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    background: true,
    cacheable: false,
    progressInterval: 1000,
    progress: progress => console.log(progress.bytesWritten)
  }).promise;
  return res;
};
