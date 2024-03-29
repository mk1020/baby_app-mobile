import {Database} from '@nozbe/watermelondb';
import * as RNFS from 'react-native-fs';
import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  LibraryDirectoryPath, MainBundlePath, readdir,
  TemporaryDirectoryPath
} from 'react-native-fs';
import {adapterByTableName} from './adapters';
import {TTables} from './types';
import {getClearPathFile, getFileName} from '../common/assistant/files';
import {unzip, zip} from 'react-native-zip-archive';
import {synchronize} from '@nozbe/watermelondb/sync';
import {database} from '../AppContainer';
import {makeId} from '../common/assistant/others';
import {storeData} from '../common/assistant/asyncStorage';
import codePush from 'react-native-code-push';
import {isIos} from '../common/phone/utils';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';
import {PermissionsAndroid} from 'react-native';
import {dateFormat} from '../common/assistant/date';
import {clearDatabase} from './assist';

interface DBExportJson {
  [tableName: string]: {
    [created: string]: any[]
  }
}
export const backupDBFileName = 'db.json';
export const exportDBToZip = async (db: Database) => {
  const backupFolderPath = DocumentDirectoryPath + '/backup';
  const backupResFolderByOS = isIos ? DocumentDirectoryPath : DownloadDirectoryPath;
  const backupResFilePath = backupResFolderByOS + '/' + `life-book-${dateFormat(new Date().getTime(), true)}.zip`;

  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ]);
  const isFolderExist = await RNFS.exists(backupFolderPath);
  if (isFolderExist) {
    await RNFS.unlink(backupFolderPath);
  }
  await RNFS.mkdir(backupFolderPath);
  const schema = await db.schema;
  const tables = Object.keys(schema?.tables);
  const batchPromises = tables.map(table => db.get(table).query().fetch());
  const collections: any[] = await Promise.all(batchPromises);

  //crete db json
  const exportJson: DBExportJson = {};

  for (const collection of collections) {
    const tableName = collection.length && collection[0].table;
    if (tableName) {
      const adaptedRecords: any = collection.map((record: any) => adapterByTableName[record.table as TTables](record));
      exportJson[tableName] = {
        created: [],
        updated: adaptedRecords,
        deleted: []
      };
      for (const record of adaptedRecords) {
        if (record?.photo) {
          //copy images to folder
          const imagesUri: string[] = record.photo.split(';');
          for (const image of imagesUri) {
            const imageName = getFileName(image);
            await RNFS.copyFile(TemporaryDirectoryPath + '/' + imageName, backupFolderPath + '/' + imageName);
          }
        }
      }
    }
  }

  //write db file
  await RNFS.writeFile(backupFolderPath + '/' + backupDBFileName, JSON.stringify(exportJson), 'utf8');
  //zip all
  await zip(backupFolderPath, backupResFilePath);
  return backupResFilePath;

};

export const importZip = async (db: Database, fileUri: string) => {
  const split = fileUri.split('/');
  const resFolderPath = split[split.length - 2];
  //delete all cached images
  const cachedFiles = await readdir(CachesDirectoryPath);
  for (const file of cachedFiles) {
    if (file.includes('.jpg') || file.includes('.json')) {
      await RNFS.unlink(CachesDirectoryPath + '/' + file);
    }
  }
  await unzip(fileUri, CachesDirectoryPath);
  await RNFS.unlink(fileUri);
  const dbJson = await RNFS.readFile(CachesDirectoryPath + '/' + backupDBFileName);
  await RNFS.unlink(CachesDirectoryPath + '/' + backupDBFileName);

  const importedDB = JSON.parse(dbJson);
  await clearDatabase(db);

  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onDidPullChanges: async () => {
      // await storeData('modalVisible', true);
      //codePush.restartApp();
    },
    pullChanges: async () => {
      return {
        changes: importedDB,
        timestamp: new Date().getTime(),
      };
    },
    pushChanges(): Promise<void> {
      return Promise.resolve(undefined);
    },
    migrationsEnabledAtVersion: 1
  });
};
