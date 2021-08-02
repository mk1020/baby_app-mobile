import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ModalDown} from './ModalDown';
import {ConditionView} from './ConditionView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {Fonts} from '../phone/fonts';

export enum ProgressState {
  None = 'None',
  InProgress = 'InProgress',
  Success = 'Success',
  Error = 'Error',
}
type TProps = {
  onRequestClose: () => void
  isVisible: boolean
  showAfterReload?: boolean
  progress: number
  indeterminate?: boolean
  state: ProgressState,
  title: string
  SuccessComponent: JSX.Element | null
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
    title,
    showAfterReload = false
  } = props;

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
        <ConditionView showIf={(state === ProgressState.Success && showAfterReload == false) || !!showAfterReload}>
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
