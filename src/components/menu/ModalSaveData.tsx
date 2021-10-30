import {ModalDown} from '../../common/components/ModalDown';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import {Fonts} from '../../common/phone/fonts';
import {Progress} from './MenuContainer';
import {ConditionView} from '../../common/components/ConditionView';
import {ModalProgressContent, ProgressState} from '../../common/components/ModalDownProgress';
import {shortPath} from '../../common/assistant/files';
import {useTranslation} from 'react-i18next';

type SaveProps = {
  color: string
  highlightColor: string
  title: string
  handler: ()=> void
}
type SuccessProps = {
  successText: string
  successSecondText: string
}

const SaveModalItem = ({title, handler, color, highlightColor}: SaveProps) => {
  return (
    <TouchableHighlight style={[styles.container, {backgroundColor: color}]} onPress={handler} underlayColor={highlightColor}>
      <View style={{padding: 8}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: 16}}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};
const SaveSuccess = (props: SuccessProps) => {
  return (
    <View style={styles.successContainer}>
      <Text style={styles.doneText}>{props.successText}</Text>
      <Text style={styles.doneText}>{props.successSecondText}</Text>
    </View>
  );
};

type Props = {
  progress: Progress
  onModalCloseRequest: ()=> void
  onPressSync: ()=> void
  onPressUploadGoogle: ()=> void
  isVisible: boolean
}
export const ModalSaveData = (props: Props) => {
  const {
    progress,
    isVisible,
    onModalCloseRequest,
    onPressSync,
    onPressUploadGoogle
  } = props;
  const {t, i18n} = useTranslation();

  return (
    <ModalDown
      onBackdropPress={onModalCloseRequest}
      onBackButtonPress={onModalCloseRequest}
      isVisible={isVisible}
    >
      <>
        <ConditionView showIf={progress.state === ProgressState.None}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View>
              <SaveModalItem
                title={'Fast sync with server'}
                handler={onPressSync}
                color={'#ffb300'}
                highlightColor={'#c68400'}
              />
            </View>
            <View>
              <SaveModalItem
                title={'Upload all on Google'}
                handler={onPressUploadGoogle}
                color={'#64dd17'}
                highlightColor={'#1faa00'}
              />
              <SaveModalItem
                title={'Get from Google'}
                handler={onPressSync}
                color={'#039be5'}
                highlightColor={'#006db3'}
              />
            </View>
          </View>
        </ConditionView>

        <ConditionView showIf={progress.state !== ProgressState.None}>
          <ModalProgressContent
            state={progress.state}
            progress={progress.progress}
            title={t('execution')}
            SuccessComponent={
              <SaveSuccess
                successText={t('allReady')}
                successSecondText={t('haveNiceDay')}
              />
            }
            ErrorComponent={
              <Text style={styles.errorText}>{t('oops')}</Text>
            }
          />
        </ConditionView>
      </>
    </ModalDown>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
  successContainer: {
    marginTop: 28
  },
  doneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'
  },
});
