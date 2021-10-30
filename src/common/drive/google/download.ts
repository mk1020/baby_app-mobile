import {CachesDirectoryPath, downloadFile, DownloadProgressCallbackResult} from 'react-native-fs';

export const download = async (
  accessToken:string,
  fileId: string,
  fileName: string,
  path: string,
  onProgress: (res: DownloadProgressCallbackResult)=> void
) => {
  const res = await downloadFile({
    fromUrl: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    toFile: path,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    background: true,
    cacheable: false,
    progressInterval: 1000,
    progress: onProgress
  }).promise;
  return res;
};
