import {StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Database} from '@nozbe/watermelondb';
import {TFunction} from 'i18next';
import {subscribe} from 'react-native-zip-archive';
import {signInGoogle} from '../assist';
import {downloadFromGoogle} from '../../../model/remoteSave/google';
import {Fonts} from '../../../common/phone/fonts';
import {ModalDown} from '../../../common/components/ModalDown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {ConditionView} from '../../../common/components/ConditionView';
import {DownloadProgressCallbackResult} from 'react-native-fs';

enum ProgressActions {
  Zip = 'Zip',
  Other = 'Other',
  Download = 'Download'
}
enum ProgressState {
  None = 'None',
  InProgress = 'InProgress',
  Success = 'Success',
  Error = 'Error',
}
type Progress = {
  progress: number
  state: ProgressState,
  action: ProgressActions,
}

const progressSubtitle = (t: TFunction) => ({
  [ProgressActions.Download]: t('loading'),
  [ProgressActions.Zip]: t('waitPlease'),
  [ProgressActions.Other]: t('waitPlease'),
});

type Props = {
  onModalCloseRequest: () => void
  isVisible: boolean
  database: any;
}
export const ImportFromGoogle = memo((props: Props) => {
  const {isVisible, onModalCloseRequest, database} = props;
  const {t, i18n} = useTranslation();

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
    if (isVisible) {
      (async () => {
        try {
          setProgress({
            state: ProgressState.InProgress,
            progress: 0,
            action: ProgressActions.Other,
          });
          const accessToken = await signInGoogle();
          await GoogleSignin.hasPlayServices();
          await downloadFromGoogle(accessToken, database as Database,
            ({bytesWritten, contentLength}: DownloadProgressCallbackResult) => {
              setProgress({
                state: bytesWritten !== contentLength ? ProgressState.InProgress : ProgressState.Success,
                progress: bytesWritten / contentLength,
                action: ProgressActions.Download,
              });
            });
          await GoogleSignin.clearCachedAccessToken(accessToken);
        } catch (e) {
          setProgress({
            state: ProgressState.Error,
            progress: 0,
            action: ProgressActions.Other,
          });
        } finally {
          await GoogleSignin.signOut();
        }
      })();
    }
  }, [isVisible]);

  const modalCloseHandler = () => {
    onModalCloseRequest();
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
        <Text style={styles.title}>{t('execution')}</Text>
        <ProgressBar
          progress={progress.progress}
          width={null}
          height={15}
          borderColor={'orange'}
          color={'rgb(236,157,36)'}
          useNativeDriver={true}
          indeterminate={
            progress.state === ProgressState.InProgress &&
            progress.action === ProgressActions.Other
          }
        />
        <Text style={styles.title}>{progressSubtitle(t)[progress.action]}</Text>

        <ConditionView showIf={progress.state === ProgressState.Success}>
          <SaveSuccess
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

type SuccessProps = {
  successText: string
  successSecondText: string
}
const SaveSuccess = (props: SuccessProps) => {
  return (
    <View style={styles.successContainer}>
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
  title: {
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
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
  container: {
    flexGrow: 1,
    borderRadius: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authErr: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
  },
  successContainer: {
    marginTop: 28
  },
});
