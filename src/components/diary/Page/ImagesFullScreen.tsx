import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {HeaderButton} from '../../../common/components/HeaderButton';
import {Images} from '../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';
import {RootStackList} from '../../../navigation/types';
import {HeaderBackButton} from '@react-navigation/stack';

type TProps = {
  route: RouteProp<RootStackList, NavigationPages.ImagesFullScreen>
}
export const ImagesFullScreen = memo((props: TProps) => {
  const {route} = props;
  const {counter, imagesUri} = route.params;
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.navigate(NavigationPages.DiaryPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <View style={styles.header}>
        <HeaderBackButton tintColor={'#fff'} onPress={onPressBack}/>
      </View>

      <ConditionView showIf={imagesUri?.length > 0}>
        <ImagesSlider
          imagesUri={imagesUri}
          mode={SliderMode.FullScreen}
          slideIndex={counter.currentIndex}
        />
      </ConditionView>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: 'rgb(254,183,77)'
  },
});
