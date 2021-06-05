import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {signIn} from '../../redux/appSlice';
import {Controller, useForm} from 'react-hook-form';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {emailRegex, passRegex} from '../../common/consts';
import {isEmptyObj} from '../../common/assistant/others';
import {navAssist} from '../../navigation/assistant';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList, TUnAuthPagesList} from '../../navigation/types';
import {ConditionView} from '../../common/components/ConditionView';

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


  const onSubmit = (data: UnpackNestedValue<IForm>) => dispatch(signIn({login: data.email, password: data.pass}));
  const signUp = () => {
    navigation.navigate(NavigationPages.SignUp);
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
          />
        )}
        name="pass"
        rules={{required: true, pattern: passRegex}}
        defaultValue=""
      />
      {errors.pass && <Text>{t('passInvalid')}</Text>}

      <TouchableOpacity disabled={!isEmptyObj(errors)} onPress={handleSubmit(onSubmit)} style={styles.sign}>
        <Text>{t('signIn')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sign} onPress={signUp}>
        <Text>{t('signUp')}</Text>
      </TouchableOpacity>

      {!!params?.signUpText && <Text>{params.signUpText}</Text>}
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
