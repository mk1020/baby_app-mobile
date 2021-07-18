import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {HeaderButton} from '../../../../common/components/HeaderButton';
import {Images} from '../../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../../navigation/types';
import {NavigationPages} from '../../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../../common/components/ConditionView';

type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.ImagesFullScreenEdit>
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
      <View style={styles.header}>
        <HeaderButton icon={Images.arrowBack} onPress={onPressBack}/>
        <HeaderButton icon={Images.delete} onPress={onPressDelete}/>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#ffcc5f'
  },
});
