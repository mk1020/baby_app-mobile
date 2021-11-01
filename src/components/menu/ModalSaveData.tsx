import {ModalDown} from '../../common/components/ModalDown';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Fonts} from '../../common/phone/fonts';
import {ProcessType, Progress, ProgressActions} from './MenuContainer';
import {ConditionView} from '../../common/components/ConditionView';
import {ModalProgressContent, ProgressState} from '../../common/components/ModalDownProgress';
import {useTranslation} from 'react-i18next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {oAuthGoogle} from '../../redux/appSlice';
import {syncDB} from '../../model/remoteSave/sync';
import {Database} from '@nozbe/watermelondb';
import {signInGoogle} from './assist';
import {downloadFromGoogle, saveInGoogleDrive} from '../../model/remoteSave/google';
import {DownloadProgressCallbackResult} from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {RootStoreType} from '../../redux/rootReducer';

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
  onModalCloseRequest: ()=> void
  isVisible: boolean
  progress: Progress
  database: any;
  setProgress: Dispatch<SetStateAction<Progress>>
}
export const ModalSaveData = (props: Props) => {
  const {isVisible, onModalCloseRequest, progress, database, setProgress} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const userToken = useSelector((state: RootStoreType) => state.app.userToken);
  const userId = useSelector((state: RootStoreType) => state.app.userId);
  const deletedPhotos = useSelector((state: RootStoreType) => state.app.deletedPhotos);
  const diaryId = useSelector((state: RootStoreType) => state.app.diaryId);
  //const [syncStarted, setSyncStarted] = useState(false);

  const onPressSync = async () => {
    try {
      //setSyncStarted(true);
      setProgress({
        progress: 0,
        state: ProgressState.InProgress,
        action: ProgressActions.Sync
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      dispatch(oAuthGoogle({oAuthIdToken: userInfo.idToken!, diaryId: diaryId!}));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      if (userToken && userId &&
        progress.state === ProgressState.InProgress &&
      progress.action === ProgressActions.Sync) {
        console.log('call sync db');
        await syncDB(database, userToken, userId, deletedPhotos).then(console.log).catch(console.log);
      }
    })();
  }, [userToken, userId, progress]);

  const onPressUploadGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const accessToken = await signInGoogle();
      await saveInGoogleDrive(database as Database, accessToken,
        (loadedMB, totalMB) => {
          console.log('total', totalMB);
          console.log('loadedMB', loadedMB);
          setProgress({
            state: loadedMB !== totalMB ? ProgressState.InProgress : ProgressState.Success,
            progress: loadedMB / totalMB,
            action: ProgressActions.Download,
            processType: ProcessType.Push
          });
        });
    } catch (e) {
      setProgress({
        state: ProgressState.Error,
        progress: 0,
        action: null,
        processType: null
      });
    }
  };

  const onPressDownloadGoogle = async () => {
    try {
      const accessToken = await signInGoogle();
      await GoogleSignin.hasPlayServices();
      await downloadFromGoogle(accessToken, database as Database,
        ({bytesWritten, contentLength}: DownloadProgressCallbackResult) => {
          setProgress({
            state: bytesWritten !== contentLength ? ProgressState.InProgress : ProgressState.Success,
            progress: bytesWritten / contentLength,
            action: ProgressActions.Download,
            processType: ProcessType.Pull
          });
        });
    } catch (e) {
      setProgress({
        state: ProgressState.Error,
        progress: 0,
        action: null,
        processType: null
      });
    }
  };

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
                handler={onPressDownloadGoogle}
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
            subtitle={progress.action === ProgressActions.Download ? t('loading') : t('waitPlease')}
            SuccessComponent={
              progress.action === ProgressActions.Zip &&
                progress.processType === ProcessType.Pull ||
              progress.action === ProgressActions.Download &&
              progress.processType === ProcessType.Push                ?
                (
                  <SaveSuccess
                    successText={t('allReady')}
                    successSecondText={t('haveNiceDay')}
                  />
                ) : null
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
