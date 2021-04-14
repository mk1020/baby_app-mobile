import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Space from '../../common/components/abstract/Space';
import { RootStackParamsList } from '../navigation/Navigator';
import { useSelector } from 'react-redux';
import { RootStoreType } from '../../storage/redux/rootReducer';
import { useTranslation } from 'react-i18next';
import i18n from '../../common/localization/localization';
interface Props {
  navigation: StackNavigationProp<RootStackParamsList, 'Home'>;
}

export const Home = ({}: Props) => {
 // const { t, i18n } = useTranslation();


  return (
    <SafeAreaView>
      <View>
        <Space.V s={8} />
        <Text>{i18n.t('hello')}</Text>
        <TouchableOpacity onPress={() => i18n.changeLanguage('ru')}>
          <Text> Change language RU</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => i18n.changeLanguage('en')}>
          <Text> Change language EN</Text>
        </TouchableOpacity>
        <Space.V s={8} />
      </View>
    </SafeAreaView>
  );
};
