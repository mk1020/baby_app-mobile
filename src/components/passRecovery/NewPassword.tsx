import React, {memo, useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex, httpBaseUrl, passRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import axios from 'axios';
import {ConditionView} from '../../common/components/ConditionView';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../navigation/pages';
import {Spinner} from '../../common/components/Spinner';
import {TUnAuthPagesList} from '../../navigation/types';

type TProps = {
  route: RouteProp<TUnAuthPagesList, NavigationPages.NewPassword>
}

interface IForm {
  code: string,
  password: string,
  confirmPassword: string,
}
enum RecoveryState {
  'default'= 'default',
  'reqInProgress' = 'reqInProgress',
  'success' = 'success',
  'error'= 'error',
}

export const NewPassword = memo((props: TProps) => {
  const {params} = props.route;
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm<IForm>();
  const [recoveryState, changeRecoveryState] = useState<RecoveryState>(RecoveryState.default);

  const navigation = useNavigation();

  const changePass = (data: UnpackNestedValue<IForm>) => {
    changeRecoveryState(RecoveryState.reqInProgress);
    axios.patch(httpBaseUrl + 'users/password', {...data, email: params.email})
      .then(() => {
        changeRecoveryState(RecoveryState.success);
        navigation.navigate(NavigationPages.SignIn, {title: t('passChanged')});
      })
      .catch(() =>  changeRecoveryState(RecoveryState.error));
  };

  return (
    <SafeAreaView>
      {!!params?.title && <Text>{params.title}</Text>}

      <Text>{t('code')}</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="code"
        rules={{required: true}}
        defaultValue=""
      />
      {errors.code && <Text>{t('emailInvalid')}</Text>}

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

      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(changePass)} style={styles.sign}>
        <Text>{t('send')}</Text>
      </TouchableOpacity>

      <ConditionView showIf={recoveryState === RecoveryState.error}>
        <Text>{t('oops')}</Text>
      </ConditionView>

      {recoveryState === RecoveryState.reqInProgress && <Spinner/>}
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
