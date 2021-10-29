import {Database} from '@nozbe/watermelondb';
import {DriveGoogle} from '../common/drive/google/DriveGoogle';
import {exportDBToZip} from './backup';
import {LoadType} from '../common/drive/google/uploadGoogle2';

// просто загрузить все на гугл диск
export async function saveInGoogleDrive(database: Database, accessToken: string, onProgress: ()=> void) {
  try {
    const appFolder = await DriveGoogle.getFile(accessToken, DriveGoogle.name);
    if (!appFolder) await DriveGoogle.createFolder(accessToken, DriveGoogle.name);
    const path = await exportDBToZip(database);
    await DriveGoogle.uploadFile(path, accessToken, LoadType.Create, onProgress, appFolder?.id);
  } catch (err) {
    console.error(err.response?.data || err.response || err);
    throw new Error('error pull sync');
  }
}

