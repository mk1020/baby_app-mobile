import React, {memo, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {dateFormat} from '../assist';
import {ImagesSlider, SliderMode} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';
import {NavigationPages} from '../../../navigation/pages';
import {useNavigation} from '@react-navigation/native';
import {parseHTML} from '../../../common/assistant/others';
import {Images} from '../../../common/imageResources';
import {setBookmarkToNote} from '../../../model/assist';
import {useDatabase} from '@nozbe/watermelondb/hooks';

type TProps = {
  id: string
  bookmarked: boolean
  title: string
  text: string
  date: number
  onPress: (bookmarked: boolean) => void
  imagesUri: string[]
}
export const NoteItem = memo((props: TProps) => {
  const {id, title, text, date, onPress, imagesUri} = props;

  const [slideIndex, changeSlideIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(props.bookmarked || false);

  const navigation = useNavigation();
  const db = useDatabase();

  const onPressImage = () => {
    const counter = {total: imagesUri?.length, currentIndex: slideIndex};
    navigation.navigate(NavigationPages.ImagesFullScreen, {counter, imagesUri});
  };

  const onPressBookmark = () => {
    try {
      setBookmarked(!bookmarked);
      if (!bookmarked) {
        setBookmarkToNote(id, !bookmarked, db);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(bookmarked)} activeOpacity={0.85}>
      <View style={styles.topBlock}>
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {title}
        </Text>
        <TouchableOpacity
          onPress={onPressBookmark}
          style={styles.bookmarkWrapper}
          hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
        >
          {
            bookmarked ? <Image style={styles.bookmark} source={Images.bookmarkFilled} /> :
              <Image style={styles.bookmark} source={Images.bookmarkBorder} />
          }
        </TouchableOpacity>
      </View>
      <ConditionView showIf={imagesUri?.length > 0}>
        <View style={styles.sliderWrapper}>
          <ImagesSlider
            imagesUri={imagesUri}
            mode={SliderMode.Preview}
            onSlideChange={changeSlideIndex}
            onPressImage={onPressImage}
          />
        </View>
      </ConditionView>
      <Text style={styles.noteText} numberOfLines={3} ellipsizeMode={'tail'}>{parseHTML(text)}</Text>
      <Text style={styles.date}>{dateFormat(date)}</Text>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
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
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  bookmarkWrapper: {
    alignSelf: 'flex-start',
    flexShrink: 1,
    marginLeft: 8
  },
  bookmark: {
    width: 24,
    height: 24,
    tintColor: '#FFA100'
  },
  sliderWrapper: {
    marginVertical: 8,
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
    flex: 1
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
