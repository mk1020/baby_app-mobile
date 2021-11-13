import {Database} from '@nozbe/watermelondb';
import {DriveGoogle} from '../../common/drive/google/DriveGoogle';
import {exportDBToZip, importZip} from '../backup';
import {LoadType} from '../../common/drive/google/uploadGoogle2';
import {CachesDirectoryPath, DownloadProgressCallbackResult, readdir} from 'react-native-fs';

// просто загрузить все на гугл диск
export async function saveInGoogleDrive(database: Database, accessToken: string, onProgress: (loadedMB: number, totalMB: number)=>void) {
  const appFolder = await DriveGoogle.getFile(accessToken, DriveGoogle.folderName).catch((e)=>{
      console.log(e)
  });
  console.log('appFolder', accessToken, DriveGoogle.folderName)
  if (!appFolder) {
      await DriveGoogle.createFolder(accessToken, DriveGoogle.folderName).catch(()=>{
          console.log('error creating folder')
      });
  }
  const path = await exportDBToZip(database);
  await DriveGoogle.uploadFile('file://' + path, accessToken, LoadType.Create, onProgress, appFolder?.id);
  console.log('end file')
}

export const downloadFromGoogle = async (accessToken: string, db: Database, onProgress: (res: DownloadProgressCallbackResult)=> void) => {
  const appFolder = await DriveGoogle.getFile(accessToken, DriveGoogle.folderName);
  const folderId = appFolder.id;

  const files = await DriveGoogle.listFiles(accessToken, folderId);
  const lastBackupId = files.length && files[0].id;
  const lastBackupName = files.length && files[0].name;
  const downloadPath = CachesDirectoryPath + '/' + lastBackupName;

  await DriveGoogle.download(accessToken, lastBackupId, lastBackupName, downloadPath, onProgress);
  await importZip(db, downloadPath);
  console.log(await readdir(CachesDirectoryPath));
  //   console.log(files);
};



