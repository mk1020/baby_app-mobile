import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {Dispatch, memo, SetStateAction, useState} from 'react';
import {Images} from '../../../../common/imageResources';
import {Fonts} from '../../../../common/phone/fonts';
import {HeaderButton} from '../../../../common/components/HeaderButton';
import {ConditionView} from '../../../../common/components/ConditionView';
import {AddPageModal} from '../../AddPageModal';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {requestSavePhotoPermission} from '../../assist';
import {DropdownMenu} from '../../../../common/components/DropdownMenu';
import {useTranslation} from 'react-i18next';
import {NotePageMode} from './NotePage';


type TProps = {
   title: string
   mode: NotePageMode
   setModalVisible: Dispatch<SetStateAction<boolean>>
   modalVisible: boolean
   onLoadImage: (imageUri: string)=> void
}
export const NoteHeader = memo((props: TProps) => {
  const {title, mode, setModalVisible, modalVisible, onLoadImage} = props;
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const onPressBack = () => {
    navigation.goBack();
  };
  const launchCallback = (response: ImagePickerResponse) => {
    console.log(response.assets);
    if (response.assets?.length) {
      onLoadImage && onLoadImage(response.assets[0].uri as string);
    }
  };

  const onPressCamera = async () => {
    setModalVisible(false);

    if (await requestSavePhotoPermission()) {
      launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true
      }, launchCallback);
    }
  };

  const onPressGallery = () => {
    setModalVisible(false);

    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, launchCallback);
  };

  const onPressPhoto = () => {
    setModalVisible(!modalVisible);
  };

  const dropdownMenuData = [
    {
      title: t('gallery'),
      onPress: onPressGallery
    },
    {
      title: t('camera'),
      onPress: onPressCamera
    }
  ];

  return (
    <View style={stylesHeader.container}>
      <HeaderButton icon={Images.arrowBack} onPress={onPressBack}/>
      <View style={stylesHeader.titleWrapper}>
        <Text style={stylesHeader.title} numberOfLines={3} ellipsizeMode={'tail'}>{title}</Text>
      </View>
      <View style={stylesHeader.rightButtons}>
        <HeaderButton icon={Images.photo} onPress={onPressPhoto}/>
        <ConditionView showIf={mode === NotePageMode.Edit}>
          <View style={stylesHeader.deleteIconWrapper}>
            <HeaderButton icon={Images.delete}/>
          </View>
        </ConditionView>
      </View>
      <ConditionView showIf={modalVisible}>
        <DropdownMenu renderData={dropdownMenuData}/>
      </ConditionView>
    </View>
  );
});

export const stylesHeader = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  titleWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    color: '#383838',
    fontFamily: Fonts.regular,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.26,
    alignSelf: 'center'
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deleteIconWrapper: {
    marginLeft: 16
  },
});
