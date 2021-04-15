import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Space from '../../common/components/abstract/Space';
import i18n from '../../common/localization/localization';
import { RootStackParamsList } from '../../navigation/types';
import { NavigationPages } from '../../navigation/pages';
import { useDispatch } from 'react-redux';
import { signIn } from '../../storage/redux/appSlice';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, NavigationPages.notifications>;
}

export const SignIn = ({}: Props) => {
  // const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <Space.V s={8} />
      <TouchableOpacity onPress={() => dispatch(signIn({ login: 'mike', password: 'pass-123' }))}>
        <Text> SIGN IN test</Text>
      </TouchableOpacity>
      <Space.V s={8} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
