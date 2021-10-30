import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ModalDown} from './ModalDown';
import {ConditionView} from './ConditionView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {Fonts} from '../phone/fonts';
import {useTranslation} from 'react-i18next';

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
  subtitle?: string
  SuccessComponent?: JSX.Element | null
  ErrorComponent: JSX.Element
}
export const ModalDownProgress = memo((props: TProps) => {

  const {
    isVisible,
    onRequestClose,
    ...other
  } = props;

  return (
    <ModalDown
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      isVisible={isVisible}
    >
      <ModalProgressContent {...other} />
    </ModalDown>
  );
});

export const ModalProgressContent = (props: Omit<TProps, 'onRequestClose' | 'isVisible'>) => {
  const {t, i18n} = useTranslation();

  const {
    progress,
    state,
    SuccessComponent =  null,
    ErrorComponent,
    title,
    showAfterReload = false,
    subtitle
  } = props;

  console.log('progress', progress);
  console.log('state', state);

  return (
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
      <Text style={styles.exportTitle}>{subtitle}</Text>

      <ConditionView showIf={(state === ProgressState.Success && showAfterReload == false) || !!showAfterReload}>
        {SuccessComponent}
      </ConditionView>

      <ConditionView showIf={state === ProgressState.Error}>
        {ErrorComponent}
      </ConditionView>
    </View>
  );
};
const styles = StyleSheet.create({
  exportModalContainer: {
    justifyContent: 'center',
    paddingHorizontal: 28
  },
  exportTitle: {
    alignSelf: 'center',
    fontFamily: Fonts.medium,
    color: '#31A0B2',
    marginBottom: 2
  },
});
