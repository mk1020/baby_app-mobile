import React, {memo, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';
import {RootStackList} from '../../../navigation/types';
import {HeaderBackButton} from '@react-navigation/stack';
import {Space} from '../../../common/components/Space';
import {SlidesCounter} from '../../../common/components/ImagesSlider/SlidesCounter';

type TProps = {
  route: RouteProp<RootStackList, NavigationPages.ImagesFullScreen>
}
export const ImagesFullScreen = memo((props: TProps) => {
  const {route} = props;
  const {counter, imagesUri} = route.params;
  const navigation = useNavigation();
  const [currSlideIndex, changeCurrSlideIndex] = useState(0);

  const onPressBack = () => {
    navigation.navigate(NavigationPages.DiaryPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <View style={styles.header}>
        <HeaderBackButton tintColor={'#fff'} onPress={onPressBack}/>
        <Space.H px={16}/>
        <SlidesCounter slide={currSlideIndex + 1} totalCount={imagesUri.length} mode={SliderMode.FullScreen}/>
      </View>

      <ConditionView showIf={imagesUri?.length > 0}>
        <ImagesSlider
          imagesUri={imagesUri}
          mode={SliderMode.FullScreen}
          slideIndex={counter.currentIndex}
          onSlideChange={changeCurrSlideIndex}
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
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgb(254,183,77)'
  },
});
