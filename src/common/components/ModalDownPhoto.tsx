import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonIconVert} from './ButtonIconVert';
import {Images} from '../imageResources';
import {deleteAlert} from './DeleteAlert';
import {ModalDown} from './ModalDown';
import {useTranslation} from 'react-i18next';

type TProps = {
  onRequestClose: () => void
  isVisible: boolean
  onPressCamera: ()=> void
  onPressGallery: ()=> void
}
export const ModalDownPhoto = memo((props: TProps) => {
  const {onRequestClose, isVisible, onPressCamera, onPressGallery} = props;
  const {t} = useTranslation();

  return (
    <ModalDown
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      isVisible={isVisible}
      flexHeight={0.15}
    >
      <View style={styles.modalContent}>
        <ButtonIconVert
          title={t('camera')}
          image={Images.camera}
          onPress={onPressCamera}
        />
        <ButtonIconVert
          title={t('gallery')}
          image={Images.gallery}
          onPress={onPressGallery}
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
