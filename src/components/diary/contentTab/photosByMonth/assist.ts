import {IPhoto} from '../../../../model/types';
export const photoAdapter = (photo: IPhoto) => ({
  diaryId: photo.diaryId,
  id: photo.id,
  photo: photo.photo,
  date: photo.date,
  createdAt: photo.createdAt,
  updatedAt: photo.updatedAt
});
export const photosDataAdapter = (photos: IPhoto[]) => {
  let photosScopeItemsData: any[] = [];
  const photosData: any[][] = [];
  photos.forEach((photo, i) => {
    photosScopeItemsData.push(photoAdapter(photo));
    if (photosScopeItemsData.length === 3) {
      photosData.push(photosScopeItemsData);
      photosScopeItemsData = [];
    }
  });
  return photosData;
};
