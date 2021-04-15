import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Space from '../../common/components/abstract/Space';
import { RootStackParamsList } from '../../navigation/types';
import { NavigationPages } from '../../navigation/pages';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { signOut } from '../../storage/redux/appSlice';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, NavigationPages.notifications>;
}

export const Notifications = ({}: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View>
        <Space.V s={8} />
        <Text>{t('hello')}</Text>
        <TouchableOpacity onPress={() => i18n.changeLanguage('ru')}>
          <Text> Change language RU</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => i18n.changeLanguage('en')}>
          <Text> Change language EN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(signOut())}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
        <Space.V s={8} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
