import {StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, memo, SetStateAction, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TFunction} from 'i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import {useTranslation} from 'react-i18next';
import {RootStoreType} from '../../../redux/rootReducer';
import {syncDB} from '../../../model/remoteSave/sync';
import {ModalDown} from '../../../common/components/ModalDown';
import {ConditionView} from '../../../common/components/ConditionView';
import {Fonts} from '../../../common/phone/fonts';
import {setLastUserEmail} from '../../../redux/appSlice';

export enum SyncActions {
  Download = 'Download',
  Upload = 'Upload',
  Other = 'Other'
}
enum ProgressState {
  None = 'None',
  InProgress = 'InProgress',
  Success = 'Success',
  Error = 'Error',
}
const progressSubtitle = (t: TFunction) => ({
  [SyncActions.Download]: t('downloadPhotos'),
  [SyncActions.Upload]: t('uploadPhotos'),
  [SyncActions.Other]: t('waitPlease')
});
export type SyncProgress = {
  totalFiles: number
  processedFiles: number
  state: ProgressState
  action: SyncActions
}
type Props = {
  onModalCloseRequest: () => void
  isVisible: boolean
  database: any;
}
export const SyncWithServer = memo((props: Props) => {
  const {isVisible, onModalCloseRequest, database} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const userToken = useSelector((state: RootStoreType) => state.app.userToken);
  const userId = useSelector((state: RootStoreType) => state.app.userId);
  const deletedPhotos = useSelector((state: RootStoreType) => state.app.deletedPhotos);
  const userEmail = useSelector((state: RootStoreType) => state.app.userEmail);
  const lastUserEmail = useSelector((state: RootStoreType) => state.app.lastUserEmail);

  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    totalFiles: 1,
    processedFiles: 0,
    state: ProgressState.None,
    action: SyncActions.Other
  });

  useEffect(() => {
    if (isVisible) {
      setSyncProgress({
        totalFiles: 1,
        processedFiles: 0,
        state: ProgressState.InProgress,
        action: SyncActions.Other
      });
    }
  }, [isVisible]);

  useEffect(() => {
    (async () => {
      if (userToken?.token && userId &&
        syncProgress.state === ProgressState.InProgress) {
        await syncDB(
          database,
          userToken,
          userId,
          deletedPhotos,
          dispatch,
          userEmail !== lastUserEmail,
          (total = 1, processed: number, action: SyncActions) => {
            setSyncProgress({
              totalFiles: total,
              processedFiles: processed,
              action,
              state: ProgressState.InProgress
            });
          });
        dispatch(setLastUserEmail(''));
        setSyncProgress({
          totalFiles: 1,
          processedFiles: 1,
          action: SyncActions.Other,
          state: ProgressState.Success
        });
        console.log('sync finish!');
      }
    })();
  }, [userToken?.token, userId, syncProgress.state]);


  const modalCloseHandler = () => {
    onModalCloseRequest();
    setSyncProgress({
      totalFiles: 1,
      processedFiles: 0,
      state: ProgressState.None,
      action: SyncActions.Other
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
          progress={syncProgress.processedFiles / syncProgress.totalFiles}
          width={null}
          height={15}
          borderColor={'orange'}
          color={'rgb(236,157,36)'}
          useNativeDriver={true}
          indeterminate={
            syncProgress.state === ProgressState.InProgress &&
            syncProgress.action === SyncActions.Other
          }
        />
        <Text style={styles.title}>{progressSubtitle(t)[syncProgress.action]}</Text>

        <ConditionView showIf={syncProgress.state === ProgressState.Success}>
          <SaveSuccess
            successText={t('allReady')}
            successSecondText={t('haveNiceDay')}
          />
        </ConditionView>

        <ConditionView showIf={syncProgress.state === ProgressState.Error}>
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
  container: {
    flexGrow: 1,
    borderRadius: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
