import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import axios, {AxiosError} from 'axios';
import {ConditionView} from '../../common/components/ConditionView';
import {useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../navigation/pages';
import {Spinner} from '../../common/components/Spinner';
import {req} from '../../common/assistant/api';

type TProps = {}

interface IForm {
  email: string,
}
enum RecoveryState {
  default= 'default',
  emailBeginSent = 'emailBeginSent',
  emailSent = 'emailSent',
  error= 'error',
}

export const PassRecovery = memo((props: TProps) => {
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError
  } = useForm<IForm>();
  const [recoveryState, changeRecoveryState] = useState<RecoveryState>(RecoveryState.default);

  const navigation = useNavigation();

  const sendEmail = (data: UnpackNestedValue<IForm>) => {
    changeRecoveryState(RecoveryState.emailBeginSent);
    req(null).patch('/password-reset', data)
      .then(() => {
        changeRecoveryState(RecoveryState.emailSent);
        navigation.navigate(NavigationPages.NewPassword, {title: t('sentEmailRecovery'), email: data.email});
      })
      .catch((err: AxiosError) => {
        changeRecoveryState(RecoveryState.error);
        setError('email', {message: err.response?.data, shouldFocus: true});
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
      {errors.email && <Text>{errors.email.message}{t('emailInvalid')}</Text>}

      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(sendEmail)} style={styles.sign}>
        <Text>{t('send')}</Text>
      </TouchableOpacity>

      {recoveryState === RecoveryState.emailBeginSent && <Spinner/>}
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
