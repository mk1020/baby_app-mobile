import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex, passRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import {AxiosError} from 'axios';
import {ConditionView} from '../../common/components/ConditionView';
import {useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../navigation/pages';
import {Spinner} from '../../common/components/Spinner';
import {req} from '../../common/assistant/api';

type TProps = {}

interface IForm {
  email: string,
  password: string,
  confirmPassword: string
}
enum SignUpState {
  default= 'default',
  reqInProgress = 'reqInProgress',
  success= 'success',
  error= 'error',
}

export const SignUp = (props: TProps) => {
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm<IForm>();
  const [signUpState, changeSignUpState] = useState<SignUpState>(SignUpState.default);

  const navigation = useNavigation();

  const signUp = (data: UnpackNestedValue<IForm>) => {
    changeSignUpState(SignUpState.reqInProgress);
    req(null).post('/signup', data)
      .then(() => {
        changeSignUpState(SignUpState.success);
        navigation.navigate(NavigationPages.SignIn, {title: t('signUpConfirm')});
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data);
        changeSignUpState(SignUpState.error);
      });
  };

  return (
    <SafeAreaView>
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
        name="password"
        rules={{required: true, pattern: passRegex}}
        defaultValue=""
      />
      {errors.password && <Text>{t('passInvalid')}</Text>}

      <Text>{t('confirmPassword')}</Text>
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
        name="confirmPassword"
        rules={{required: true, validate: fieldValue => fieldValue === getValues().password}}
        defaultValue=""
      />
      {errors.confirmPassword && <Text>{t('confirmErr')}</Text>}
      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(signUp)} style={styles.sign}>
        <Text>{t('signUp')}</Text>
      </TouchableOpacity>

      <ConditionView showIf={signUpState === SignUpState.error}>
        <Text>{t('signUpErr')}</Text>
      </ConditionView>
      {signUpState === SignUpState.reqInProgress  && <Spinner/>}

    </SafeAreaView>
  );
};

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
