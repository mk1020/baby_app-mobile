import {S3} from 'aws-sdk';
import {CachesDirectoryPath, downloadFile, DownloadProgressCallbackResult, readdir, readFile, unlink} from 'react-native-fs';
import {getFileName} from '../../common/assistant/files';
import {decode} from 'base64-arraybuffer';
import {ManagedUpload} from 'aws-sdk/clients/s3';
import Config from 'react-native-config';
import {AWSError} from 'aws-sdk/lib/error';
import {NotesTableName} from '../schema';
import {SyncActions} from "../../components/menu/IntegrationWithInternet/SyncWithServer";

export const uploadOnS3 = (filePath: string, contentType: string) => {
  return new Promise(async (resolve, reject) => {
    const s3bucket = new S3({
      accessKeyId: Config.S3ACCESSKEYID,
      secretAccessKey: Config.S3SECRETACCESSKEY,
      endpoint: Config.S3ENDPOINT,
      signatureVersion: 'v4',

    });
    console.log('filePath', filePath);
    const name = getFileName(filePath);
    const contentDeposition = 'inline;filename="' + name + '"';
    const base64 = await readFile(filePath, 'base64');

    const arrayBuffer = decode(base64);
    s3bucket.createBucket(() => {
      const params = {
        Bucket: Config.S3IMAGESBUCKET,
        Key: name,
        Body: arrayBuffer,
        ContentDisposition: contentDeposition,
        ContentType: contentType,
      };

      s3bucket.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) reject(err); else resolve(data);
      });
    });
  });
};

export const downloadFromS3 = (fileName: string, contentType: string, onProgress?: (res: DownloadProgressCallbackResult)=> void) => {
  return new Promise(async (resolve, reject) => {
    const s3bucket = new S3({
      accessKeyId: Config.S3ACCESSKEYID,
      secretAccessKey: Config.S3SECRETACCESSKEY,
      endpoint: Config.S3ENDPOINT,
      signatureVersion: 'v4',
      region: Config.S3REGION
    });

    const params = {Bucket: Config.S3IMAGESBUCKET, Key: fileName};
    s3bucket.getSignedUrl('getObject', params, (err, url) => {
      console.log('Your generated pre-signed URL is', url);
      if (url) {
        downloadFile({
          fromUrl: url,
          toFile: CachesDirectoryPath + '/' + fileName,
          headers: {
            'Content-Type': contentType,
          },
          background: true,
          cacheable: false,
          progressInterval: 1000,
          progress: onProgress
        }).promise.then(data => resolve(data))/*.catch(err => reject(err))*/;
      }
    });
  });
};

export const deleteFromS3 = (fileName: string) => {
  return new Promise(async (resolve, reject) => {
    const s3bucket = new S3({
      accessKeyId: Config.S3ACCESSKEYID,
      secretAccessKey: Config.S3SECRETACCESSKEY,
      endpoint: Config.S3ENDPOINT,
      signatureVersion: 'v4',
      region: Config.S3REGION
    });
    const params = {Bucket: Config.S3IMAGESBUCKET, Key: fileName};

    s3bucket.deleteObject(params, (err: AWSError, data: S3.Types.DeleteObjectOutput) => {
      if (err) reject(err); else resolve(data);
    });
  });
};

export const isFileExistS3 = (fileName: string) => {
  const s3bucket = new S3({
    accessKeyId: Config.S3ACCESSKEYID,
    secretAccessKey: Config.S3SECRETACCESSKEY,
    endpoint: Config.S3ENDPOINT,
    signatureVersion: 'v4',
    region: Config.S3REGION
  });
  const params = {Bucket: Config.S3IMAGESBUCKET, Key: fileName};
  s3bucket.headObject(params);
};

export const downloadNewPhotosS3 = async (photos: any[], onProgress: (total: number, processed: number, action: SyncActions)=> void) => {
  const photoNames = photos.map(photo => getFileName(photo.photo!)).filter(photo => !!photo);
  const existedPhotos = await readdir(CachesDirectoryPath);

  for (let i = 0; i < photoNames.length; i++) {
    if (!existedPhotos.includes(photoNames[i]) && photoNames[i]) {
      const downloaded = await downloadFromS3(photoNames[i], 'image/jpeg')/*.catch(err => console.log('file not exit in s3', photoNames[i]))*/;
      console.log('downloaded', downloaded);
      onProgress(photoNames.length, i + 1, SyncActions.Download);
    }
  }
};

export const uploadNewPhotosOnS3 = async (photos: any[], onProgress: (total: number, processed: number, action: SyncActions)=> void) => {
  const photosForUploadDirty: string[] = photos.filter(photo => !!photo?.photo).map(photo => photo.photo);
  let photosForUpload: string[] = [];

  photosForUploadDirty.forEach(item => {
    const splitedPhoto = item.split(';');
    photosForUpload = [...photosForUpload, ...splitedPhoto];
  });

  for (let i = 0; i < photosForUpload.length; i++) {
    const uploaded = await uploadOnS3(photosForUpload[i], 'image/jpeg');
    onProgress(photosForUpload.length, i + 1, SyncActions.Upload);
    console.log(uploaded);
  }
};

export const deletePhotosFromS3 = async (photosIds: string[], db: any) => {
  for (const id of photosIds) {
    console.log('photo to delete Ids', photosIds);
    const photo = await db.get(NotesTableName).find(id).catch(() => console.log('photo was not found', id));
    console.log('photo to delete', photo);

    if (photo) {
      await db.write(async () => {
        await photo.update((photo: any) => {
          photo.photo = null;
        });
      });
    }
    if (photo) {
      const deleted = await deleteFromS3(getFileName(photo.photo)).catch(err => console.log('file not exit in s3', photo));
      await unlink(photo.photo).catch(err => console.log('file not exit in cache', photo));
      console.log(deleted);
    }
  }
};

export const deletePhotosFromS3_URI = async (photosUri: string[]) => {
  for (const uri of photosUri) {
    const deleted = await deleteFromS3(getFileName(uri)).catch(err => console.log('file not exit in s3', uri));
    //await unlink(uri).catch(err => console.log('file not exit in cache', uri));
    console.log(deleted);
  }
};

