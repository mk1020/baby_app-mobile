import React, {memo, useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {Fonts} from '../../../../common/phone/fonts';
import {dateFormat} from '../../assist';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ImagesSlider, SliderMode} from '../../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../../common/components/ConditionView';
import {NavigationPages} from '../../../../navigation/pages';
import {useNavigation} from '@react-navigation/native';
import {INoteJS} from '../../../../model/types';

interface IForm {
  title: string
  note: string
}
type TProps = {
  imagesUri: string[]
  noteData?: INoteJS
}

const textNoteLineHeight = 24;
export const NoteCard = memo((props: TProps) => {
  const {imagesUri = [], noteData} = props;
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>();
  const [slideIndex, changeSlideIndex] = useState(0);
  //const [textNoteCountLines, changeTextNoteCountLines] = useState(0);
  //const [textNoteHeight, changeTextNoteHeight] = useState(0);

  const onPressImage = () => {
    const counter = {total: imagesUri.length, currentIndex: slideIndex};
    navigation.navigate(NavigationPages.ImagesFullScreenEdit, {counter, imagesUri});
  };

  /*const separatorsRenderItems = useMemo(() => {
    const renderItems = [];
    for (let i = 1; i <= textNoteCountLines + 2; i++) {
      renderItems.push(<View key={`separator- ${i}`} style={styles.separator}></View>);
    }
    return renderItems;
  }, [textNoteCountLines]);*/

  /*const onContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const {width, height} = e.nativeEvent.contentSize;
    if (Math.abs(textNoteHeight - height) > textNoteLineHeight - 1) {
      if (height > textNoteHeight) {
        changeTextNoteCountLines(textNoteCountLines + 1);
        changeTextNoteHeight(height);
      } else {
        changeTextNoteCountLines(textNoteCountLines - 1);
        changeTextNoteHeight(height);
      }
    }
  };*/
const currentDate = new Date().getTime();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.title}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder={t('noteTitle')}
            placeholderTextColor={'rgba(144,133,133,0.5)'}
            defaultValue={noteData?.title}
          />
        )}
        name="title"
        rules={{required: true}}
        defaultValue=""
      />
      <ConditionView showIf={imagesUri.length > 0}>
        <TouchableWithoutFeedback onPress={onPressImage}>
          <View>
            <ImagesSlider
              imagesUri={imagesUri}
              mode={SliderMode.Preview}
              onSlideChange={changeSlideIndex}
            />
          </View>
        </TouchableWithoutFeedback>
      </ConditionView>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.noteText}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder={t('typeText')}
            placeholderTextColor={'rgba(144,133,133,0.5)'}
            multiline={true}
            textAlign={'left'}
            defaultValue={noteData?.note}
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
    paddingTop: 16,
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
