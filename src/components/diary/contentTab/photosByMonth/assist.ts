import {IPhoto} from '../../../../model/types';
import {photoAdapterJs} from '../../../../model/adapters';

export const photosDataAdapter = (photos: IPhoto[]) => {
  let photosScopeItemsData: any[] = [];
  const photosData: any[][] = [];
  photos.forEach((photo, i) => {
    photosScopeItemsData.push(photoAdapterJs(photo));
    if (photosScopeItemsData.length === 3) {
      photosData.push(photosScopeItemsData);
      photosScopeItemsData = [];
    }
  });
  return photosData;
};
