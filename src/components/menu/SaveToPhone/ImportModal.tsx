import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {useTranslation} from 'react-i18next';
import {subscribe} from 'react-native-zip-archive';
import {ModalDown} from '../../../common/components/ModalDown';
import {ConditionView} from '../../../common/components/ConditionView';
import {Fonts} from '../../../common/phone/fonts';
import DocumentPicker from 'react-native-document-picker';
import {importZip} from '../../../model/backup';
import {Database} from '@nozbe/watermelondb';

enum ProgressState {
  None = 'None',
  InProgress = 'InProgress',
  Success = 'Success',
  Error = 'Error',
}
enum ProgressActions {
  Zip = 'Zip',
  Other = 'Other',
}
export type Progress = {
  progress: number
  state: ProgressState,
  action: ProgressActions,
}
type TProps = {
  onRequestClose: () => void
  isVisible: boolean
  database: any
}
export const ImportModal = memo((props: TProps) => {
  const {t, i18n} = useTranslation();

  const {
    isVisible,
    onRequestClose,
    database
  } = props;

  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    state: ProgressState.None,
    action: ProgressActions.Other,
  });

  useEffect(() => {
    const zipProgress = subscribe(res => {
      if (res.progress === 1) {
        setProgress({
          ...progress,
          state: ProgressState.Success,
          progress: 1,
          action: ProgressActions.Zip
        });
      } else {
        setProgress({
          ...progress,
          state: ProgressState.InProgress,
          progress: res.progress,
          action: ProgressActions.Zip
        });
      }
    });
    return () => zipProgress.remove();
  }, [progress]);

  useEffect(() => {
    (async () => {
      if (isVisible) {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.zip],
            copyTo: 'cachesDirectory',
          });
          setProgress({...progress, state: ProgressState.InProgress, action: ProgressActions.Zip});
          await importZip(database as Database, res?.fileCopyUri);
        } catch (e) {
          if (DocumentPicker.isCancel(e)) {
            setProgress({
              state: ProgressState.None,
              progress: 0,
              action: ProgressActions.Other,
            });
          } else {
            console.log(e);
            setProgress({
              state: ProgressState.Error,
              progress: 0,
              action: ProgressActions.Other,
            });
          }

        }
      }
    })();
  }, [isVisible]);

  const modalCloseHandler = () => {
    onRequestClose();
    setProgress({
      state: ProgressState.None,
      action: ProgressActions.Other,
      progress: 0
    });
  };
  return (
    <ModalDown
      onBackdropPress={modalCloseHandler}
      onBackButtonPress={modalCloseHandler}
      isVisible={isVisible}
    >
      <View style={styles.exportModalContainer}>
        <Text style={styles.subtitle}>{t('exportData')}</Text>
        <ProgressBar
          progress={progress.progress}
          width={null}
          height={15}
          borderColor={'orange'}
          color={'rgb(236,157,36)'}
          useNativeDriver={true}
          indeterminate={
            progress.state === ProgressState.InProgress &&
            //(progress.progress === 0 || progress.progress === 1)
            progress.action === ProgressActions.Other
          }
        />
        <Text style={styles.subtitle}>{t('waitPlease')}</Text>

        <ConditionView showIf={progress.state === ProgressState.Success}>
          <ImportSuccess
            successText={t('allReady')}
            successSecondText={t('haveNiceDay')}
          />
        </ConditionView>

        <ConditionView showIf={progress.state === ProgressState.Error}>
          <Text style={styles.errorText}>{t('oops')}</Text>
        </ConditionView>
      </View>
    </ModalDown>
  );
});

type ImportSuccessProps = {
  successText: string
  successSecondText: string
}
const ImportSuccess = (props: ImportSuccessProps) => {
  return (
    <View style={styles.importSuccessContainer}>
      <Text style={styles.doneText}>{props.successText}</Text>
      <Text style={styles.doneText}>{props.successSecondText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exportModalContainer: {
    justifyContent: 'center',
    paddingHorizontal: 28
  },
  subtitle: {
    alignSelf: 'center',
    fontFamily: Fonts.medium,
    color: '#31A0B2',
    marginBottom: 2
  },
  doneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'
  },
  importSuccessContainer: {
    marginTop: 28
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
});
