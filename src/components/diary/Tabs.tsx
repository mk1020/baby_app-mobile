import React, {Dispatch, memo, SetStateAction, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {ContentTab} from './contentTab/ContentTab';
import {useTranslation} from 'react-i18next';
import {NavigationState, SceneRendererProps} from 'react-native-tab-view/lib/typescript/src/types';
import {Fonts} from '../../common/phone/fonts';

type TProps = {
   currentTabIndex: number
   onIndexChange: Dispatch<SetStateAction<number>>
}

const renderScene = SceneMap({
  first: ContentTab,
  second: ContentTab,
});

export const Tabs = memo((props: TProps) => {
  const {currentTabIndex, onIndexChange} = props;
  const {t, i18n} = useTranslation();

  const [routes] = useState([
    {key: 'first', title: t('content')},
    {key: 'second', title: t('hashtags')},
  ]);

  const width =  useMemo(() => Dimensions.get('window').width, []);
  const height =  useMemo(() => Dimensions.get('window').height, []);

  return (
    <TabView
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabBarIndicator}
          style={styles.tabBar}
          labelStyle={styles.tabBarLabel}
          activeColor={'#383838'}
          inactiveColor={'#31A0B2'}
        />
      )}
      navigationState={{index: currentTabIndex, routes}}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      initialLayout={{width, height}}
    />
  );
});

const styles = StyleSheet.create({
  tabBarIndicator: {
    backgroundColor: '#31A0B2',
    height: 3
  },
  tabBar: {
    backgroundColor: 'white'
  },
  tabBarLabel: {
    color: '#31A0B2',
    fontFamily: Fonts.regular,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    textTransform: 'uppercase'
  }
});
