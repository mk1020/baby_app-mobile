import {IPhoto} from '../../../../model/types';
import {photoAdapterJs} from '../../../../model/adapters';

export const photosDataAdapter = (photos: IPhoto[]) => {
  let photosScopeItemsData: any[] = [];
  const photosData: any[][] = [];

  const photosAdapted = photos?.map((photo: IPhoto) => photoAdapterJs(photo));
  photosAdapted?.sort((a: IPhoto, b: IPhoto) => {
    return a.date - b.date;
  });

  photosAdapted.forEach((photo, i) => {
    photosScopeItemsData.push(photo);
    if (photosScopeItemsData.length === 3) {
      photosData.push(photosScopeItemsData);
      photosScopeItemsData = [];
    }
  });
  return photosData;
};
