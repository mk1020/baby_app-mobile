import {IPhoto} from '../../../../model/types';
import {photoAdapter} from '../../../../model/adapters';

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
