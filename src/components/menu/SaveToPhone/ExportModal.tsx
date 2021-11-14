import React, {memo, useEffect, useState} from 'react';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {useTranslation} from 'react-i18next';
import {subscribe} from 'react-native-zip-archive';
import {ModalDown} from '../../../common/components/ModalDown';
import {ConditionView} from '../../../common/components/ConditionView';
import {Fonts} from '../../../common/phone/fonts';
import {isIos} from '../../../common/phone/utils';
import {Images} from '../../../common/imageResources';
import {shortPath} from '../../../common/assistant/files';
import {exportDBToZip} from '../../../model/backup';
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
export const ExportModal = memo((props: TProps) => {
  const {t, i18n} = useTranslation();
  const [backupFilePath, setBackupFilePath] = useState('');

  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    state: ProgressState.None,
    action: ProgressActions.Other,
  });

  const {
    isVisible,
    onRequestClose,
    database
  } = props;

  useEffect(() => {
    try {
      if (backupFilePath && isIos) {
        (async () => {
          const result = await Share.share({
            url: backupFilePath
          });
          if (result.action === 'dismissedAction') {
            onRequestClose();
          }
        })();
      }
    } catch (e) {
      console.log(e);
    }
  }, [backupFilePath]);

  useEffect(() => {
    (async () => {
      if (isVisible) {
        try {
          setProgress({...progress, state: ProgressState.InProgress, action: ProgressActions.Zip});
          const backupFilePath = await exportDBToZip(database as Database);
          backupFilePath && setBackupFilePath(backupFilePath);
        } catch (e) {
          console.log(e);
          setProgress({
            state: ProgressState.Error,
            progress: 0,
            action: ProgressActions.Other,
          });
        }
      }
    })();
  }, [isVisible]);



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
            // (progress.progress === 0 || progress.progress === 1)
            progress.action === ProgressActions.Other
          }
        />
        <Text style={styles.subtitle}>{t('waitPlease')}</Text>

        <ConditionView showIf={progress.state === ProgressState.Success}>
          <ExportSuccess
            backupFilePath={shortPath(backupFilePath)}
            doneText={t('exportDone')}
          />
        </ConditionView>

        <ConditionView showIf={progress.state === ProgressState.Error}>
          <Text style={styles.errorText}>{t('oops')}</Text>
        </ConditionView>
      </View>
    </ModalDown>
  );
});

type ExportSuccessProps = {
  backupFilePath: string
  doneText: string
}
const ExportSuccess = (props: ExportSuccessProps) => {
  return (
    <>
      <Text style={styles.doneText}>{props.doneText}</Text>
      <ConditionView showIf={!isIos}>
        <View style={styles.exportPathContainer}>
          <Image source={Images.where} style={styles.imagePath}/>
          <Text style={styles.modalBlackText}>
            {props.backupFilePath}
          </Text>
        </View>
      </ConditionView>
    </>
  );
};
const styles = StyleSheet.create({
  exportModalContainer: {
    justifyContent: 'center',
    paddingHorizontal: 28
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
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
  exportPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#f6eaea',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  imagePath: {
    marginRight: 8,
    width: 24,
    height: 24,
    tintColor: '#FFA100'
  },
  modalBlackText: {
    fontFamily: Fonts.regular,
    fontSize: 14
  },
});
