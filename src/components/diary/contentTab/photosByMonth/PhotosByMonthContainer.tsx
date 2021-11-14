import React, {memo, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ModalDownPhoto} from '../../../../common/components/ModalDownPhoto';
import {ModalDown} from '../../../../common/components/ModalDown';
import {ButtonIconVert} from '../../../../common/components/ButtonIconVert';
import {Images} from '../../../../common/imageResources';
import {PhotosByMonth} from './PhotosByMonth';
import {IPhoto} from '../../../../model/types';
import {PhotosTableName} from '../../../../model/schema';
import {NavigationPages} from '../../../../navigation/pages';
import {HeaderButtonSimple} from '../../../../common/components/HeaderButtonSimple';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {RootStackList} from '../../../../navigation/types';
import {Database} from '@nozbe/watermelondb';
import {useTranslation} from 'react-i18next';
import {photosDataAdapter} from './assist';
import {addNPhotos} from '../../../../model/assist';
import {photoAdapterJs} from '../../../../model/adapters';

type TProps = {
  route?: RouteProp<RootStackList, NavigationPages.PhotosByMonth>
  database: Database
  photos: any[]
}
const photoDefaultData = {
  id: '',
  photo: null,
  diaryId: '',
  updatedAt: 0,
  createdAt: 0,
  date: 0,
};
export const PhotosByMonthContainer_ = memo((props: TProps) => {
  const {route, database, photos} = props;
  const deletedPhotoId = route?.params?.deletedPhotoId;
  const diaryId = route?.params?.diaryId;

  const navigation = useNavigation();
  const {t} = useTranslation();
  const [modalAddPhotoVisible, setModalAddPhotoVisible] = useState(false);
  const [modalAddCardsVisible, setModalAddCardsVisible] = useState(false);
  const [addingPhotoData, setAddingPhotoData] = useState<IPhoto>(photoDefaultData);

  const [photosRenderData, setPhotosRenderData] = useState<IPhoto[][]>([[photoDefaultData]]);

  useEffect(() => {
    setPhotosRenderData(photosDataAdapter(photos));
  }, [photos]);

  useEffect(() => {
    const newPhoto = photos?.map(photo => (photo.id === addingPhotoData.id ? addingPhotoData : photo));
    setPhotosRenderData(photosDataAdapter(newPhoto));
  }, [addingPhotoData]);

  useEffect(() => {
    const newPhoto = photos?.map(photo => {
      const adaptedPhoto = photoAdapterJs(photo);
      adaptedPhoto.photo = null;
      return photo.id === deletedPhotoId ? adaptedPhoto : photo;
    });
    setPhotosRenderData(photosDataAdapter(newPhoto));
  }, [deletedPhotoId]);

  const onLoadPhoto = async (uri: string) => {
    try {
      const targetPhoto = await database.get(PhotosTableName).find(addingPhotoData.id);
      // @ts-ignore
      await targetPhoto.updatePhoto(uri);
      setAddingPhotoData({...addingPhotoData, photo: uri || null});
    } catch (e) {
      console.log(e);
    }
  };
  const onPressAddTwelveCards = async () => {
    try {
      console.log(diaryId)

      if (diaryId) {
        console.log('prepareCreatePhotos')

        await addNPhotos(12, diaryId, database);
        setModalAddCardsVisible(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPressAddCards = () => {
    setModalAddCardsVisible(true);
  };

  const onPressAddPhoto = useCallback((photo: IPhoto) => {
    setModalAddPhotoVisible(true);
    setAddingPhotoData(photo);
  }, []);

  const onRequestCloseModal = () => {
    setModalAddPhotoVisible(false);
    setModalAddCardsVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderButtonSimple icon={Images.addPhotoAlternate} onPress={onPressAddCards}/>
    });
  }, [navigation]);

  const onPressPhoto = useCallback((photo: IPhoto) => {
    navigation.navigate(NavigationPages.ImageFullScreen, {imageUri: photo.photo, imageId: photo.id});
  }, [navigation]);

  return (
    <>
      <PhotosByMonth
        onPressPhoto={onPressPhoto}
        onPressAddPhoto={onPressAddPhoto}
        renderData={photosRenderData}
      />
      <ModalDownPhoto
        onRequestClose={onRequestCloseModal}
        isVisible={modalAddPhotoVisible}
        onLoadImage={onLoadPhoto}
      />
      <ModalDown
        onBackdropPress={onRequestCloseModal}
        onBackButtonPress={onRequestCloseModal}
        isVisible={modalAddCardsVisible}
      >
        <View style={{paddingHorizontal: 28}}>
          <ButtonIconVert
            title={t('addTwelveCards')}
            image={Images.playlistAdd}
            onPress={onPressAddTwelveCards}
          />
        </View>
      </ModalDown>
    </>
  );
});

export const PhotosByMonthContainer = withDatabase(withObservables([], ({database, route}: TProps) => {
  return {
    photos: database.collections.get(PhotosTableName).query().observe(),
  };
})(PhotosByMonthContainer_));
const styles = StyleSheet.create({});
