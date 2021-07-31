import {Database} from '@nozbe/watermelondb';
import * as RNFS from 'react-native-fs';
import {CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath} from 'react-native-fs';
import {adapterByTableName} from './adapters';
import {TTables} from './types';
import {getClearPathFile} from '../common/assistant/files';
import {unzip, zip} from 'react-native-zip-archive';
import DocumentPicker from 'react-native-document-picker';
import {synchronize} from '@nozbe/watermelondb/sync';
import {database} from '../AppContainer';
import {makeId} from '../common/assistant/others';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import RNRestart from 'react-native-restart';

interface DBExportJson {
  [tableName: string]: {
    [created: string]: any[]
  }
}
export const backupDBFileName = 'db.json';
export const exportDBToZip = async (db: Database) => {
  const backupFolderPath = DocumentDirectoryPath + '/backup';

  try {
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
              const imageSplit = image.split('/');
              const imageName = imageSplit[imageSplit.length - 1];
              await RNFS.copyFile(getClearPathFile(image), backupFolderPath + '/' + imageName);
            }
          }
        }
      }
    }

    //write db file
    await RNFS.writeFile(backupFolderPath + '/' + backupDBFileName, JSON.stringify(exportJson), 'utf8');

    //zip all
    const backupFilePath = DownloadDirectoryPath + '/' + makeId(8) + '- life-book-backup.zip';
    await zip(backupFolderPath, backupFilePath);
    return backupFilePath;
  } catch (e) {
    console.log(e);
  } finally {
    await RNFS.unlink(backupFolderPath).catch(e => console.log(e));
  }
};

export const importZip = async (db: Database) => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.zip],
      copyTo: 'cachesDirectory',
    });
    const split = res.fileCopyUri.split('/');
    const resFolderPath = split[split.length - 2];

    await unzip(getClearPathFile(res.fileCopyUri), CachesDirectoryPath);
    // await RNFS.readdir(CachesDirectoryPath);
    await RNFS.unlink(CachesDirectoryPath + '/' + resFolderPath);
    const dbJson = await RNFS.readFile(CachesDirectoryPath + '/' + backupDBFileName);
    const importedDB = JSON.parse(dbJson);
    await db?.write(async () => {
      await db?.unsafeResetDatabase();
    });

    await synchronize({
      database,
      sendCreatedAsUpdated: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onDidPullChanges: () => {
        RNRestart.Restart();
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
