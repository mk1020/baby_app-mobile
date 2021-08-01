import React, {memo, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ButtonIconVert} from './ButtonIconVert';
import {Images} from '../imageResources';
import {deleteAlert} from './DeleteAlert';
import {ModalDown} from './ModalDown';
import {useTranslation} from 'react-i18next';
import {requestSavePhotoPermission} from '../../components/diary/assist';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {ConditionView} from './ConditionView';
import {shortPath} from '../assistant/files';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {Fonts} from '../phone/fonts';

export enum ProgressState {
  None='None',
  InProgress= 'InProgress',
  Success= 'Success',
  Error= 'Error',
}
type TProps = {
  onRequestClose: () => void
  isVisible: boolean
  progress: number
  indeterminate?: boolean
  state: ProgressState,
  title: string
  SuccessComponent: JSX.Element
  ErrorComponent: JSX.Element
}
export const ModalDownProgress = memo((props: TProps) => {
  const {
    isVisible,
    onRequestClose,
    indeterminate,
    progress,
    state,
    SuccessComponent,
    ErrorComponent,
    title
  } = props;
  console.log(progress === 0 || progress === 1 && state === ProgressState.InProgress);
  console.log('progress', progress, 'state', state);
  return (
    <ModalDown
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      isVisible={isVisible}
    >
      <View style={styles.exportModalContainer}>
        <Text style={styles.exportTitle}>{title}</Text>
        <ProgressBar
          progress={progress}
          width={null}
          height={15}
          borderColor={'orange'}
          color={'rgb(236,157,36)'}
          useNativeDriver={true}
          indeterminate={progress === 0 || progress === 1 && state === ProgressState.InProgress}
        />
        <ConditionView showIf={state === ProgressState.Success}>
          {SuccessComponent}
        </ConditionView>

        <ConditionView showIf={state === ProgressState.Error}>
          {ErrorComponent}
        </ConditionView>
      </View>
    </ModalDown>
  );
});
const styles = StyleSheet.create({
  exportModalContainer: {
    justifyContent: 'center',
  },
  exportTitle: {
    alignSelf: 'center',
    fontFamily: Fonts.medium,
    color: '#31A0B2',
    marginBottom: 2
  },


});
