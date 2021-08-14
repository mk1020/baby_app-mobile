import axios from 'axios';
import {blobFromUri, getFileName} from '../../assistant/files';
import {getChunkSize} from './assist';

export enum LoadType {
  Create = 'Create',
  Update = 'Update'
}
export const uploadGoogle =
  async (
    fileUri: string,
    accessToken: string,
    loadType: LoadType,
    onProgress: (loadedMB: number, totalMB: number)=>void,
    parentFolderID: string
  ) => {
    const fileName = getFileName(fileUri);
    const file = await blobFromUri(fileUri);

    const res = await axios.request({
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      data: {name: fileName, parents: [parentFolderID]},
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'application/octet-stream',
        'Content-Length': file.size,
        'X-Upload-Content-Length': file.size
      },
      method: loadType === LoadType.Create ? 'POST' : 'PUT'
    });
    const chunkSize = getChunkSize(file.size);
    const location = res?.headers?.location;
    let progress = 0;
    const onProgressLoad = (e: ProgressEvent) => {
      progress += e.loaded;
      onProgress(progress / 1024 / 1024, file.size / 1024 / 1024); //сколько загружено в мб
    };
    return await sendFile({location, onProgressLoad, file, offset: 0, chunkSize});
  };

type SendFileProps = {
  location: string,
  onProgressLoad: (e: ProgressEvent)=>void,
  file: Blob,
  offset: number,
  chunkSize: number
}
const sendFile = (props: SendFileProps) => new Promise((resolve, reject) => {
  const {chunkSize, file, location, offset, onProgressLoad} = props;
  const xhr = new XMLHttpRequest();
    xhr.upload?.addEventListener('progress', e => onProgressLoad(e));
    xhr.onload = e => onLoadChunk(e, xhr, {file, chunkSize, location, onProgressLoad, offset}, resolve, reject);
    xhr.onerror = e => {
      reject(e);
    };
    xhr.open('PUT', location, true);

    let end = file.size;
    let file_ = file;
    if (offset || chunkSize) {
      if (chunkSize) {
        end = Math.min(offset + chunkSize, file.size);
      }
      file_ = file_.slice(offset, end);
    }
    xhr.setRequestHeader('Content-Length', file.size.toString());
    xhr.setRequestHeader('X-Upload-Content-Length', file.size.toString());
    xhr.setRequestHeader('Content-Range', 'bytes ' + offset + '-' + (end - 1) + '/' + file.size);

    xhr.send(file_);
});

const onLoadChunk = async (e: any, xhr: XMLHttpRequest, fileProps: SendFileProps, resolve: any, reject: any) => {
  const {chunkSize, file, location, offset, onProgressLoad} = fileProps;

  if (e.target?.status == 200 || e.target?.status == 201) {
    resolve(e);
  } else if (e.target?.status == 308) {
    const range = xhr.getResponseHeader('Range');
    if (range) {
      const offset_ = parseInt(<string>range?.match(/\d+/g)?.pop(), 10) + 1;
      await sendFile({location, onProgressLoad, file, offset: offset_, chunkSize});
    }
  } else {
    reject(e);
  }
};
