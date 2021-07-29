import React, {memo, useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {Fonts} from '../../phone/fonts';
import {Route} from 'react-native-tab-view/lib/typescript/src/types';
import {SliderImage} from './SliderImage';
import {ConditionView} from '../ConditionView';
import {SlidesCounter} from './SlidesCounter';

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
      <SliderImage
        uri={route.key}
        onPressImage={onPressImage}
        mode={mode}
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
      <ConditionView showIf={mode === SliderMode.Preview}>
        <SlidesCounter slide={index + 1} totalCount={routes.length} mode={SliderMode.Preview}/>
      </ConditionView>
    </View>
  );
});

const styles = StyleSheet.create({
  containerModePreview: {
    flexDirection: 'row'
  },
  containerModeFull: {
    flex: 1,
  },
  tabViewPreview: {
    height: 185
  }
});
