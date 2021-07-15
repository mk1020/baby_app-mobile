import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {memo, useState} from 'react';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';
import {HeaderButton} from '../../../common/components/HeaderButton';
import {ConditionView} from '../../../common/components/ConditionView';
import {AddPageModal} from '../AddPageModal';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {requestSavePhotoPermission} from '../assist';

export enum NoteHeaderType {
  Create = 'Create',
  Edit = 'Edit'
}
type TProps = {
   title: string
   headerFor: NoteHeaderType
}
export const NoteHeader = memo((props: TProps) => {
  const {title, headerFor} = props;
  const navigation = useNavigation();

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const onPressBack = () => {
    navigation.goBack();
  };
  const launchCallback = (response: ImagePickerResponse) => {
    console.log(response.assets);
  };

  const onPressCamera = async () => {
    if (await requestSavePhotoPermission()) {
      launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true
      }, launchCallback);
    }
  };

  const onPressGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, launchCallback);
  };

  const onPressPhoto = () => {
    setShowPhotoMenu(!showPhotoMenu);
  };

  return (
    <View style={stylesHeader.container}>
      <HeaderButton icon={Images.arrowBack} onPress={onPressBack}/>
      <View style={stylesHeader.titleWrapper}>
        <Text style={stylesHeader.title} numberOfLines={3} ellipsizeMode={'tail'}>{title}</Text>
      </View>
      <View style={stylesHeader.rightButtons}>
        <HeaderButton icon={Images.photo} onPress={onPressPhoto}/>
        <ConditionView showIf={headerFor === NoteHeaderType.Edit}>
          <View style={stylesHeader.deleteIconWrapper}>
            <HeaderButton icon={Images.delete}/>
          </View>
        </ConditionView>
      </View>
      <ConditionView showIf={showPhotoMenu}>
        <View style={stylesHeader.photoMenu}>
          <TouchableHighlight underlayColor={'#E5E5E5'} onPress={onPressGallery}>
            <Text>Галерея</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#E5E5E5'} onPress={onPressCamera}>
            <Text>Камера</Text>
          </TouchableHighlight>
        </View>
      </ConditionView>
    </View>
  );
});

export const stylesHeader = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  photoMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    zIndex: 999,
    elevation: 10
  }
});
