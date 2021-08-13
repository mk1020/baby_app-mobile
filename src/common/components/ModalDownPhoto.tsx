import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonIconVert} from './ButtonIconVert';
import {Images} from '../imageResources';
import {ModalDown} from './ModalDown';
import {useTranslation} from 'react-i18next';
import {requestSavePhotoPermission} from '../../components/diary/assist';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {isIos} from '../phone/utils';
import {getImagePath} from '../assistant/files';

type TProps = {
  onLoadImage: (uri: string) => void
  onRequestClose: () => void
  isVisible: boolean
}
export const ModalDownPhoto = memo((props: TProps) => {
  const {isVisible, onLoadImage, onRequestClose} = props;
  const {t} = useTranslation();

  const onPressCamera = async () => {
    const hasPermission = isIos ? true : await requestSavePhotoPermission();
    if (hasPermission)
      launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
      }, (response: ImagePickerResponse) => {
        if (response.assets?.length) {
          const path = getImagePath(response.assets[0].uri as string);
          onLoadImage(path);
        }
        !response.didCancel && onRequestClose();
      });
  };

  const onPressGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, (response: ImagePickerResponse) => {
      if (response.assets?.length) {
        console.log(response)
        const path = getImagePath(response.assets[0].uri as string);
        onLoadImage(path);
      }
      !response.didCancel && onRequestClose();
    });
  };

  return (
    <ModalDown
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      isVisible={isVisible}
      flexHeight={0.15}
    >
      <View style={styles.modalContent}>
        <ButtonIconVert
          title={t('gallery')}
          image={Images.gallery}
          onPress={onPressGallery}
        />
        <ButtonIconVert
          title={t('camera')}
          image={Images.camera}
          onPress={onPressCamera}
        />
      </View>
    </ModalDown>
  );
});
const styles = StyleSheet.create({
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
