import DocumentPicker from 'react-native-document-picker';
import {ModalDownProgress, ProgressState} from '../../common/components/ModalDownProgress';
import {exportDBToZip, importZip} from '../../model/backup';
import {Database} from '@nozbe/watermelondb';
import {ProcessType, Progress, ProgressActions} from './MenuContainer';
import React, {useEffect, useState} from 'react';
import {isIos} from '../../common/phone/utils';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
import {shortPath} from '../../common/assistant/files';
import {ConditionView} from '../../common/components/ConditionView';
import {Images} from '../../common/imageResources';
import {Fonts} from '../../common/phone/fonts';
import {useTranslation} from 'react-i18next';

type TProps = {
  progress: Progress
  setProgress: any
  onModalCloseRequest: ()=> void
  database: any
  exportStarted: boolean
  importStarted: boolean
}
export const SaveDataToPhoneContainer = (props: TProps) => {
  const {setProgress, progress, onModalCloseRequest, database, exportStarted, importStarted} = props;
  const {t, i18n} = useTranslation();
  const [backupFilePath, setBackupFilePath] = useState('');

  useEffect(() => {
    try {
      if (backupFilePath && isIos) {
        (async () => {
          const result = await Share.share({
            url: backupFilePath
          });
          if (result.action === 'dismissedAction') {
            onModalCloseRequest();
          }
        })();
      }
    } catch (e) {
      console.log(e);
    }
  }, [backupFilePath]);

  useEffect(() => {
    (async () => {
      if (importStarted) {
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
              processType: null
            });
          } else {
            console.log(e);
            setProgress({
              state: ProgressState.Error,
              progress: 0,
              action: ProgressActions.Other,
              processType: null
            });
          }

        }
      }
    })();
  }, [importStarted]);

  useEffect(() => {
    (async () => {
      if (exportStarted) {
        try {
          setProgress({...progress, state: ProgressState.InProgress, action: ProgressActions.Zip});
          const backupFilePath = await exportDBToZip(database as Database);
          backupFilePath && setBackupFilePath(backupFilePath);
        } catch (e) {
          setProgress({
            state: ProgressState.Error,
            progress: 0,
            action: ProgressActions.Other,
            processType: null
          });
        }
      }
    })();
  }, [exportStarted]);

  return (
    <>
      <ModalDownProgress
        isVisible={exportStarted && progress.processType === ProcessType.Export}
        state={progress.state}
        onRequestClose={onModalCloseRequest}
        progress={progress.progress}
        title={t('exportData')}
        SuccessComponent={
          <ExportSuccess
            backupFilePath={shortPath(backupFilePath)}
            doneText={t('exportDone')}
          />
        }
        ErrorComponent={
          <Text style={styles.errorText}>{t('oops')}</Text>
        }
      />
      <ModalDownProgress
        isVisible={importStarted && progress.processType === ProcessType.Import}
        state={progress.state}
        showAfterReload={progress?.showModalAfterReload}
        onRequestClose={onModalCloseRequest}
        progress={progress.progress}
        title={t('waitPlease')}
        SuccessComponent={
          <ImportSuccess
            successText={t('allReady')}
            successSecondText={t('haveNiceDay')}
          />
        }
        ErrorComponent={
          <Text style={styles.errorText}>{t('oops')}</Text>
        }
      />
    </>
  );
};

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
  doneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'
  },
  importSuccessContainer: {
    marginTop: 28
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
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
});
