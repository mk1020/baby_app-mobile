import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {NavigationPages} from '../../navigation/pages';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {signIn} from '../../redux/appSlice';
import {useForm, Controller} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex, passRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import {Message} from 'react-hook-form/dist/types/errors';

interface IProps {
}

interface IForm {
  email: string,
  pass: string,
  confirmPass: string
}
export const SignUp = ({}: IProps) => {
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>();

  const dispatch = useDispatch();
  const onSubmit = (data: UnpackNestedValue<IForm>) => dispatch(signIn({login: data.email, password: data.pass}));

  return (
    <SafeAreaView>
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
        name="email"
        rules={{required: true, pattern: emailRegex}}
        defaultValue=""
      />
      {errors.email && <Text>Validation Error</Text>}

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
        name="pass"
        rules={{required: true, pattern: passRegex}}
        defaultValue=""
      />
      {errors.pass && <Text>Validation Error</Text>}

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
        name="confirmPass"
        rules={{required: true, validate: (formDate: IForm) => {
          console.warn(formDate);
          return formDate.pass === formDate.confirmPass;
        }}}
        defaultValue=""
      />
      {errors.confirmPass && <Text>Password should be equal to Confirm Password</Text>}
      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(onSubmit)}>
        <Text>Войти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    color: '#000',
    marginBottom: 10
  },
});
