import React, {Dispatch, memo, SetStateAction, useMemo, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {ContentTab} from './contentTab/ContentTab';
import {useTranslation} from 'react-i18next';
import {Fonts} from '../../common/phone/fonts';
import {HashtagTab} from './hashtagTab/HashtagTab';

type TProps = {
   currentTabIndex: number
   onIndexChange: Dispatch<SetStateAction<number>>
   diaryId: string
}



export const Tabs = memo((props: TProps) => {
  const {currentTabIndex, onIndexChange, diaryId} = props;
  const {t, i18n} = useTranslation();

  const [routes] = useState([
    {key: 'first', title: t('content')},
    {key: 'second', title: t('hashtags')},
  ]);
  const width =  useMemo(() => Dimensions.get('window').width, []);
  const height =  useMemo(() => Dimensions.get('window').height, []);

  const renderScene = useMemo(() => (
    SceneMap({
      first: () => <ContentTab diaryId={diaryId}/>,
      second: () => <HashtagTab diaryId={diaryId}/>,
    })
  ), [diaryId]);

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
