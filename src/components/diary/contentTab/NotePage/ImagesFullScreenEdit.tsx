import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Images} from '../../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../../common/components/ConditionView';
import {RootStackList} from '../../../../navigation/types';
import {HeaderButtonSimple} from '../../../../common/components/HeaderButtonSimple';
import {HeaderBackButton} from '@react-navigation/stack';
import {SlidesCounter} from '../../../../common/components/ImagesSlider/SlidesCounter';
import {Space} from '../../../../common/components/Space';

type TProps = {
  route: RouteProp<RootStackList, NavigationPages.ImagesFullScreenEdit>
}
export const ImagesFullScreenEdit = memo((props: TProps) => {
  const {route} = props;

  const counter = route.params?.counter;
  const _imagesUri = route.params?.imagesUri;

  const navigation = useNavigation();
  const [imagesUri, changeImagesUri] = useState<string[]>(_imagesUri);
  const [deletedImagesUri, changeDeletedImagesUri] = useState<string[]>([]);
  const [currSlideIndex, changeCurrSlideIndex] = useState(0);

  useEffect(() => {
    changeImagesUri(_imagesUri);
  }, [_imagesUri]);

  const onPressBack = () => {
    navigation.navigate(NavigationPages.NotePage, {imagesUri, deletedImagesUri});
  };

  const onPressDelete = () => {
    const images = [...imagesUri];
    const deletedImage = images.splice(currSlideIndex, 1);
    changeDeletedImagesUri([...deletedImagesUri, ...deletedImage]);
    changeImagesUri(images);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HeaderBackButton tintColor={'#fff'} onPress={onPressBack}/>
          <Space.H px={16}/>
          <SlidesCounter slide={currSlideIndex + 1} totalCount={imagesUri.length} mode={SliderMode.FullScreen}/>
        </View>
        <HeaderButtonSimple icon={Images.delete} onPress={onPressDelete}/>
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    height: 56,
    backgroundColor: 'rgb(254,183,77)'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
