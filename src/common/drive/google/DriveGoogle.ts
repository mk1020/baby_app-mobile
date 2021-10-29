import {uploadGoogle} from './uploadGoogle2';
import {createFolder} from './createFolder';
import {isExist} from './isExist';
import {getFile} from './getFile';
import {listFiles} from './listFiles';
import {deleteFile} from './deleteFile';
import {download} from './download';

export class DriveGoogle {
  static folderName = 'life_book'
  static backupName = 'life_book_backup.zip'
  static uploadFile = uploadGoogle
  static createFolder = createFolder
  static isExist = isExist
  static getFile = getFile
  static listFiles = listFiles
  static deleteFile = deleteFile
  static download = download
}
