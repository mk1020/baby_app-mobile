import {StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, memo, SetStateAction, useMemo, useState} from 'react';
import {Images} from '../../../../common/imageResources';
import {Fonts} from '../../../../common/phone/fonts';
import {HeaderButton} from '../../../../common/components/HeaderButton';
import {ConditionView} from '../../../../common/components/ConditionView';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {requestSavePhotoPermission} from '../../assist';
import {DropdownMenu} from '../../../../common/components/DropdownMenu';
import {useTranslation} from 'react-i18next';
import {NotePageMode} from './NotePage';
import {commonAlert} from '../../../../common/components/CommonAlert';
import {ModalDownPhoto} from '../../../../common/components/ModalDownPhoto';


type TProps = {
   title: string
   mode: NotePageMode
   onLoadImage: (imageUri: string)=> void
   onPressDelete: () => void
}
export const NoteHeader = memo((props: TProps) => {
  const {title, mode, onLoadImage, onPressDelete} = props;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const onPressBack = () => {
    navigation.goBack();
  };
  const onLoadPhoto = (response: ImagePickerResponse) => {
    if (response.assets?.length) {
      onLoadImage && onLoadImage(response.assets[0].uri as string);
    }
  };

  const onPressPhoto = () => {
    setModalVisible(true);
  };

  const onRequestCloseModal = () => {
    setModalVisible(false);
  };

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
            <HeaderButton icon={Images.delete} onPress={() => commonAlert(t, t('deleteNoteTitle'), t('deleteNoteMessage'), onPressDelete)}/>
          </View>
        </ConditionView>
      </View>
      <ModalDownPhoto
        onRequestClose={onRequestCloseModal}
        isVisible={modalVisible}
        onLoadImage={onLoadPhoto}
      />
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
