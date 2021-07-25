import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

type TProps = {
   children: JSX.Element
   onBackdropPress: ()=> void
   onBackButtonPress: ()=> void
   flexHeight?: number
   isVisible: boolean
}
export const ModalDown = memo((props: TProps) => {
  const {children, onBackButtonPress, onBackdropPress, flexHeight = 0.5, isVisible} = props;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalView, {flexShrink: flexHeight}]}>
          {children}
        </View>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flexDirection: 'row',
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
