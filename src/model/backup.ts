import {Database} from '@nozbe/watermelondb';
import * as RNFS from 'react-native-fs';
import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  LibraryDirectoryPath, MainBundlePath,
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

interface DBExportJson {
  [tableName: string]: {
    [created: string]: any[]
  }
}
export const backupDBFileName = 'db.json';
export const exportDBToZip = async (db: Database) => {
  const backupFolderPath = DocumentDirectoryPath + '/backup';

  try {
    const isFolderExist = await RNFS.exists(backupFolderPath);
    if (isFolderExist) {
      await RNFS.unlink(backupFolderPath);
    }
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
            //create folder
            await RNFS.mkdir(backupFolderPath);
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
    const backupFolderByOS = isIos ? DocumentDirectoryPath : DownloadDirectoryPath;
    const backupFilePath = backupFolderByOS + '/' + makeId(8) + '-life-book-backup.zip';
    await zip(backupFolderPath, backupFilePath);
    return backupFilePath;
  }  finally {
    await RNFS.unlink(backupFolderPath).catch(e => console.log(e));
  }
};

export const importZip = async (db: Database, fileUri: string) => {
  try {
    const split = fileUri.split('/');
    const resFolderPath = split[split.length - 2];
    await unzip(fileUri, CachesDirectoryPath);
    await RNFS.unlink(CachesDirectoryPath + '/' + resFolderPath).catch();
    const dbJson = await RNFS.readFile(CachesDirectoryPath + '/' + backupDBFileName);
    const importedDB = JSON.parse(dbJson);
    await db?.write(async () => {
      //await db?.unsafeResetDatabase();
      await database.get(NotesTableName).query().destroyAllPermanently();
      await database.get(PagesTableName).query().destroyAllPermanently();
      await database.get(ChaptersTableName).query().destroyAllPermanently();
      await database.get(DiaryTableName).query().destroyAllPermanently();
      await database.get(PhotosTableName).query().destroyAllPermanently();
    });

    await synchronize({
      database,
      sendCreatedAsUpdated: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onDidPullChanges: async () => {
        await storeData('modalVisible', true);
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
  } catch (e) {
    console.log(e);
  }
};
