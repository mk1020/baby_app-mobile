import React, {memo, useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {Fonts} from '../../phone/fonts';
import {Route} from 'react-native-tab-view/lib/typescript/src/types';
import {ImagePreview} from './ImagePreview';

export enum SliderMode {
  FullScreen = 'FullScreen',
  Preview = 'Preview',
}
type TProps = {
  imagesUri: string[]
  slideIndex?: number
  mode: SliderMode
  onSlideChange?: (index: number) => void
  onPressImage?: () => void
}

export const ImagesSlider = memo((props: TProps) => {
  const {imagesUri, mode, slideIndex = 0, onSlideChange, onPressImage} = props;

  const [index, setIndex] = useState(slideIndex);
  const [routes, setRoutes] = useState<{key: string}[]>([]);

  useEffect(() => {
    setRoutes(imagesUri?.map(uri => ({key: uri})));
  }, [imagesUri]);

  const width =  useMemo(() => Dimensions.get('window').width, []);
  const height =  useMemo(() => Dimensions.get('window').height, []);

  const renderScene = ({route}: {route: Route}) => {
    return (
      <ImagePreview
        uri={route.key}
        onPressImage={onPressImage}
      />
    );
  };

  const onChangeIndex = (index: number) => {
    onSlideChange && onSlideChange(index);
    setIndex(index);
  };

  return (
    <View style={[mode === SliderMode.Preview ? styles.containerModePreview : styles.containerModeFull]}>
      <TabView
        renderTabBar={props => null}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={onChangeIndex}
        initialLayout={{width, height}}
        style={[mode === SliderMode.Preview ? styles.tabViewPreview : {}]}
      />
      <View style={styles.counter}>
        <Text style={styles.counterText}>{index + 1}/{routes.length}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  containerModePreview: {
    flexDirection: 'row'
  },
  containerModeFull: {
    flex: 1
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
  },
  tabViewPreview: {
    height: 185
  }
});
