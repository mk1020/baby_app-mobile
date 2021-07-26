import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {HeaderButton} from '../../../../common/components/HeaderButton';
import {Images} from '../../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../../common/components/ConditionView';
import {RootStackList} from '../../../../navigation/types';
import {HeaderButtonSimple} from '../../../../common/components/HeaderButtonSimple';

type TProps = {
  route: RouteProp<RootStackList, NavigationPages.ImagesFullScreenEdit>
}
export const ImagesFullScreenEdit = memo((props: TProps) => {
  const {route} = props;

  const counter = route.params?.counter;
  const _imagesUri = route.params?.imagesUri;

  const navigation = useNavigation();
  const [imagesUri, changeImagesUri] = useState<string[]>(_imagesUri);
  const [currSlideIndex, changeCurrSlideIndex] = useState(0);

  useEffect(() => {
    changeImagesUri(_imagesUri);
  }, [_imagesUri]);

  const onPressBack = () => {
    navigation.navigate(NavigationPages.NotePage, {imagesUri});
  };

  const onPressDelete = () => {
    const images = [...imagesUri];
    images.splice(currSlideIndex, 1);
    changeImagesUri(images);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <View style={styles.header}>
        <HeaderButtonSimple icon={Images.arrowBackFull} onPress={onPressBack}/>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgb(254,183,77)'
  },
});
