import React, {memo, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Keyboard} from 'react-native';
import {Fonts} from '../../../../common/phone/fonts';
import {dateFormat} from '../../assist';
import {Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ImagesSlider, SliderMode} from '../../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../../common/components/ConditionView';
import {NavigationPages} from '../../../../navigation/pages';
import {useNavigation} from '@react-navigation/native';
import {Control} from 'react-hook-form/dist/types/form';
import {IFormNote} from './NotePage';
import {RichEditor} from 'react-native-pell-rich-editor';
import {generateAssetsFontCss, getHTML} from '../../Page/assiat';
import {Images} from '../../../../common/imageResources';


type TProps = {
  formControl: Control<IFormNote>
  noteData: IFormNote
  onCursorPosition?: (offsetY: number)=> void
  editorRef?: React.RefObject<RichEditor>
}
const textNoteLineHeight = 24;
export const NoteCard = memo((props: TProps) => {
  const {formControl, noteData, onCursorPosition, editorRef} = props;
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  const [slideIndex, changeSlideIndex] = useState(0);
  const formErrors = formControl.formStateRef?.current?.errors;

  const onPressImage = () => {
    const counter = {total: noteData.imagesUri?.length, currentIndex: slideIndex};
    navigation.navigate(NavigationPages.ImagesFullScreenEdit, {counter, imagesUri: noteData.imagesUri});
    return true;
  };

  const currentDate = new Date().getTime();
  const editorStyle = {
    color: '#5a5757',
    placeholderColor: formErrors?.note ? 'orange' : 'rgba(144,133,133,0.5)',
    contentCSSText: `font-size: 18px; ${generateAssetsFontCss(Fonts.regular, 'ttf')}`
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBlock}>
        <Controller
          control={formControl}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.title}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              placeholder={t('noteTitle')}
              placeholderTextColor={formErrors?.title ? 'orange' : 'rgba(144,133,133,0.5)'}
              defaultValue={noteData?.title}
            />
          )}
          name="title"
          rules={{required: true}}
          defaultValue=""
        />

        <Controller
          control={formControl}
          render={({field: {onChange, onBlur, value}}) => (
            <TouchableOpacity
              onPress={() => onChange(!value)}
              style={styles.bookmarkWrapper}
              hitSlop={{top: 5, bottom: 5, left: 10, right: 10}}
            >
              {
                value ? <Image style={styles.bookmark} source={Images.bookmarkFilled} /> :
                  <Image style={styles.bookmark} source={Images.bookmarkBorder} />
              }
            </TouchableOpacity>
          )}
          name="bookmarked"
          rules={{required: false}}
          defaultValue={false}
        />
      </View>
      <ConditionView showIf={noteData.imagesUri?.length > 0}>
        <ImagesSlider
          imagesUri={noteData.imagesUri}
          mode={SliderMode.Preview}
          onSlideChange={changeSlideIndex}
          onPressImage={onPressImage}
        />
      </ConditionView>
      <Controller
        control={formControl}
        render={({field: {onChange, onBlur, value}}) => (
        /*<TextInput
            style={styles.noteText}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder={t('typeText')}
            placeholderTextColor={formErrors?.note ? 'orange' : 'rgba(144,133,133,0.5)'}
            multiline={true}
            textAlign={'left'}
            defaultValue={noteData?.note}
          />*/
          <RichEditor
            onChange={text => onChange(text)}
            placeholder={t('typeText')}
            ref={editorRef}
            initialContentHTML={noteData?.note}
            contentMode={'mobile'}
            useContainer={true}
            onCursorPosition={onCursorPosition}
            editorStyle={editorStyle}
          />
        )}
        name="note"
        rules={{required: true}}
        defaultValue=""
      />
      <Text style={styles.date}>{noteData?.createdAt ? dateFormat(noteData.createdAt) : dateFormat(currentDate)}</Text>
    </View>
  );
});


const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 8,
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
    alignItems: 'center'
  },
  bookmarkWrapper: {
    alignSelf: 'center',
    marginLeft: 8,
    flexShrink: 1
  },
  bookmark: {
    width: 24,
    height: 24,
    tintColor: '#FFA100',
  },
  noteTextContainer: {
  },
  separatorsContainer: {
    marginTop: 16
  },
  noteText: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    lineHeight: textNoteLineHeight,
    color: '#5a5757',
    marginHorizontal: 8,
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
  },
  separator: {
    backgroundColor: '#EBF6FA',
    height: 2,
    marginHorizontal: 8,
    marginBottom: 17
  }
});
