import React, {memo} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootStoreType} from '../../../redux/rootReducer';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {oAuthGoogle, setLoadingAppStatus} from '../../../redux/appSlice';
import {Spinner} from '../../../common/components/Spinner';
import {commonAlert} from '../../../common/components/CommonAlert';
import {clearDatabase, createDiaryIfNotExist} from '../../../model/assist';
import {useDatabase} from '@nozbe/watermelondb/hooks';

type TProps = {
  diaryId: string
}
export const UnAuthCardUser = memo((props: TProps) => {
  const {diaryId} = props;
  const {t} = useTranslation();
  const database = useDatabase();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoading = useSelector((state: RootStoreType) => state.app.isLoading);
  const lastUserEmail = useSelector((state: RootStoreType) => state.app.lastUserEmail);

  const onOAuthGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //dispatch(setLoadingAppStatus(true));
      if (userInfo.user.email !== lastUserEmail) {
        commonAlert(t, t('warning'), t('warningChangeAcc'), async () => {
          await clearDatabase(database);
          const id = await createDiaryIfNotExist(database);
          dispatch(oAuthGoogle({oAuthIdToken: userInfo.idToken!, diaryId: id}));
        },
        async () => {
          //await GoogleSignin.revokeAccess().catch();
          await GoogleSignin.signOut();
        });
      } else {
        dispatch(oAuthGoogle({oAuthIdToken: userInfo.idToken!, diaryId}));
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        dispatch(setLoadingAppStatus(false));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        dispatch(setLoadingAppStatus(false));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Images.login} style={styles.imageLogin}/>
      <GoogleSigninButton
        //style={{width: 48, height: 48, shadowOpacity: 1, elevation: 0, borderWidth: 0}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onOAuthGoogle}
        //disabled={this.state.isSigninInProgress}
      />

      {isLoading && <Spinner/>}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderRadius: 10
  },
  imageLogin: {
    height: 27,
    width: 74,
    tintColor: '#FFA100',
    marginBottom: 8
  },
  email: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginTop: 5
  },
  lastSync: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#31A0B2'
  },
});
