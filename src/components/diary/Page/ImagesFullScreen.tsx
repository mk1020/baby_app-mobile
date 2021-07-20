import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {HeaderButton} from '../../../common/components/HeaderButton';
import {Images} from '../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../navigation/types';
import {NavigationPages} from '../../../navigation/pages';
import {ImagesSlider, SliderMode} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';

type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.ImagesFullScreen>
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
      <View style={styles.header}>
        <HeaderButton icon={Images.arrowBack} onPress={onPressBack}/>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#ffcc5f'
  },
});
