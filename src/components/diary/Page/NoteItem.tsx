import React, {memo, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {dateFormat} from '../assist';
import {ImagesSlider, SliderMode} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';
import {NavigationPages} from '../../../navigation/pages';
import {useNavigation} from '@react-navigation/native';

type TProps = {
  title: string
  text: string
  date: number
  onPress: ()=> void
  imagesUri: string[]
}
export const NoteItem = memo((props: TProps) => {
  const {title, text, date, onPress, imagesUri} = props;

  const [slideIndex, changeSlideIndex] = useState(0);
  const navigation = useNavigation();

  const onPressImage = () => {
    const counter = {total: imagesUri?.length, currentIndex: slideIndex};
    navigation.navigate(NavigationPages.ImagesFullScreen, {counter, imagesUri});
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title}>{title}</Text>
      <ConditionView showIf={imagesUri?.length > 0}>
        <ImagesSlider
          imagesUri={imagesUri}
          mode={SliderMode.Preview}
          onSlideChange={changeSlideIndex}
          onPressImage={onPressImage}
        />
      </ConditionView>
      <Text style={styles.noteText} numberOfLines={3} ellipsizeMode={'tail'}>{text}</Text>
      <Text style={styles.date}>{dateFormat(date)}</Text>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 16,
    marginBottom: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowRadius: 10,
        shadowColor: 'rgba(49, 160, 178, 0.25)',
      },
      android: {
        elevation: 3,
      }
    }),
  },
  noteText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: '#716e6e',
    marginTop: 8
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: '#41C3CD',
    marginBottom: 13
  },
  date: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#BAC0CF',
    alignSelf: 'flex-end',
    marginTop: 6
  }
});
