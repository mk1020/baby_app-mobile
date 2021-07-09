import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {oAuthGoogle, setLoadingAppStatus, signIn} from '../../redux/appSlice';
import {Controller, useForm} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex, googleOAuthClientId, passRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TUnAuthPagesList} from '../../navigation/types';
import {RootStoreType} from '../../redux/rootReducer';
import {Spinner} from '../../common/components/Spinner';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {DiaryTableName} from '../../model/schema';
import {database} from '../../AppContainer';

type TProps = {
  route: RouteProp<TUnAuthPagesList, NavigationPages.SignIn>
}

interface IForm {
  email: string,
  pass: string
}

export const SignIn = memo((props:TProps) => {
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoading = useSelector((state: RootStoreType) => state.app.isLoading);

  const newDiary = async () => {
    const diaryCollection = database.get(DiaryTableName);
    await database.action(async () => {
      await diaryCollection.create((diary: any) => {
        diary.userId = 27;
        diary.name = 'Test дневник 3';
        diary.isCurrent = true;
      });
    });
  };

  const onOAuthGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      dispatch(setLoadingAppStatus(true));
      dispatch(oAuthGoogle({oAuthIdToken: userInfo.idToken!}));
      await GoogleSignin.revokeAccess();

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

  const onSignIn = (data: UnpackNestedValue<IForm>) => {
    dispatch(setLoadingAppStatus(true));
    dispatch(signIn({login: data.email, password: data.pass}));
  };
  const signUp = () => {
    navigation.navigate(NavigationPages.SignUp);
  };
  const passRecovery = () => {
    navigation.navigate(NavigationPages.PassRecovery);
  };

  return (
    <SafeAreaView>
      {!!params?.title && <Text>{params.title}</Text>}

      <Text>{t('email')}</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
          />
        )}
        name="email"
        rules={{required: true, pattern: emailRegex}}
        defaultValue=""
      />
      {errors.email && <Text>{t('emailInvalid')}</Text>}

      <Text>{t('password')}</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            autoCompleteType={'password'}
            secureTextEntry={true}
          />
        )}
        name="pass"
        rules={{required: true, pattern: passRegex}}
        defaultValue=""
      />
      {errors.pass && <Text>{t('passInvalid')}</Text>}

      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(onSignIn)} style={styles.sign}>
        <Text>{t('signIn')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sign} onPress={signUp}>
        <Text>{t('signUp')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sign} onPress={passRecovery}>
        <Text>{t('passRecovery')}</Text>
      </TouchableOpacity>

      <GoogleSigninButton
        // style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Icon}
        color={GoogleSigninButton.Color.Dark}
        onPress={onOAuthGoogle}
        //disabled={this.state.isSigninInProgress}
      />

      {isLoading && <Spinner/>}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    color: '#000',
  },
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10
  }
});
