import React, {Dispatch, memo, SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import {Fonts} from '../../phone/fonts';
import {Route} from 'react-native-tab-view/lib/typescript/src/types';
import {ImagePreview} from './ImagePreview';
import {current} from '@reduxjs/toolkit';

type TProps = {
  imagesUri: string[]
}

export const ImagesSlider = memo((props: TProps) => {
  const {imagesUri} = props;
  const {t, i18n} = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<{key: string}[]>([]);

  useEffect(() => {
    setRoutes(imagesUri?.map(uri => ({key: uri})));
  }, [imagesUri]);

  const width =  useMemo(() => Dimensions.get('window').width, []);
  const height =  useMemo(() => Dimensions.get('window').height, []);

  const renderScene = ({route}: {route: Route}) => {
    return <ImagePreview uri={route.key} />;
  };

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={props => null}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width, height}}
        style={{height: 185}}

      />
      <View style={styles.counter}>
        <Text style={styles.counterText}>{index + 1}/{routes.length}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  counter: {
    width: 34,
    height: 21,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8
  },
  counterText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#ffffff'
  }
});
