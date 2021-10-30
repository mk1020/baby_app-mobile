import React, {memo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {inputsRegex} from '../../common/consts';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import DropDownPicker from 'react-native-dropdown-picker';
import {Fonts} from '../../common/phone/fonts';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {ConditionView} from '../../common/components/ConditionView';
import {Space} from '../../common/components/Space';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {ChaptersTableName} from '../../model/schema';
import {createPage, createPageAndChapter} from '../../model/assist';
import {ButtonFilled, ButtonModes} from '../../common/components/ButtonFilled';
import {ModalDown} from '../../common/components/ModalDown';

type TProps = {
  onRequestClose: ()=> void
  diaryId: string
  chapters?: {diaryId: string, id: string, name: string, number: number, createdAt: number, updatedAt: number}[]
}

export interface IFormCretePage {
  pageName: string,
  newChapter: string
  selectedChapter: number | string
}


export const AddPageModal = memo((props: TProps) => {
  const {t} = useTranslation();
  const {onRequestClose, chapters = [], diaryId} = props;

  const defaultItemsChapters = [
    {label: t('createNewChapter'), value: 0}, //0 - создание главы
    {label: t('withoutChapter'), value: 1} //1 - без главы
  ];
  const chaptersPikerItems = chapters.map(chapter => ({
    label: chapter.name, value: chapter.id
  }));
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm<IFormCretePage>();

  const [openChapterPicker, setOpenChapterPicker] = useState(false);
  const [chapterItems, setChapterItems] = useState([...defaultItemsChapters, ...chaptersPikerItems]);

  const database = useDatabase();

  const onPressAdd = async (data: UnpackNestedValue<IFormCretePage>) => {
    try {
      onRequestClose();
      const chaptersCount = await database?.get(ChaptersTableName).query().fetchCount();
      if (data.selectedChapter === 0) { // 0 - значение стандартного элемента в выпадающем списке. Означает "Создать главу"
        createPageAndChapter(database, data, diaryId, chaptersCount + 1).then();
      } else {
        createPage(database, data, diaryId, typeof data.selectedChapter === 'string' ? data.selectedChapter : null).then();
      }

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalDown
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      flexHeight={getValues().selectedChapter === 0 ? flex['.45'] : flex['.40']}
      isVisible={true}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 28}}
      >
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <DropDownPicker
              open={openChapterPicker}
              value={value}
              items={chapterItems}
              setOpen={setOpenChapterPicker}
              setValue={callback => onChange(callback(value))}
              setItems={setChapterItems}
              style={styles.picker}
              textStyle={styles.pickerTextStyle}
              dropDownDirection={'BOTTOM'}
              listMode={'SCROLLVIEW'}
              scrollViewProps={{showsVerticalScrollIndicator: false}}
              modalProps={{
                animationType: 'fade',
              }}
            />
          )}
          name="selectedChapter"
          rules={{required: false}}
          defaultValue={defaultItemsChapters[1].value}
        />
        <Space.V px={16} />
        <ConditionView showIf={getValues().selectedChapter === 0}>
          <>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <View style={[styles.inputWrapper, errors.newChapter && styles.fieldErrView]}>
                  <TextInput
                    placeholder={'Название главы'}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.input}
                    placeholderTextColor={'#41C3CD'}
                  />
                </View>
              )}
              name="newChapter"
              rules={{required: true, pattern: inputsRegex}}
              defaultValue=""
            />
            <Space.V px={16} />
          </>
        </ConditionView>

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={[styles.inputWrapper, errors.pageName && styles.fieldErrView]}>
              <TextInput
                placeholder={'Название страницы'}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                placeholderTextColor={'#41C3CD'}
              />
            </View>
          )}
          name="pageName"
          rules={{required: true, pattern: inputsRegex}}
          defaultValue=""
        />
        <Space.V px={24}/>
        <View style={styles.buttonsWrapper}>
          <ButtonFilled
            title={t('cancel')}
            mode={ButtonModes.Negative}
            onPress={onRequestClose}
          />
          <Space.V px={24}/>
          <ButtonFilled
            title={t('done')}
            mode={ButtonModes.Positive}
            onPress={handleSubmit(onPressAdd)}
          />
        </View>
      </ScrollView>
    </ModalDown>
  );
});
const fieldStyle: ViewStyle = {
  backgroundColor: '#EBF6FA',
  borderWidth: 2,
  borderColor: '#41C3CD',
  borderStyle: 'solid',
  borderRadius: 10,
};

const fieldTextStyle: TextStyle = {
  fontSize: 18,
  lineHeight: 21,
  color: '#41C3CD',
  fontFamily: Fonts.bold,
};
const flex = {
  '.40': 0.40,
  '.45': 0.47,
};
const styles = StyleSheet.create({
  scrollViewContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  picker: {
    ...fieldStyle,
  },
  pickerTextStyle: {
    ...fieldTextStyle
  },
  inputWrapper: {
    ...fieldStyle,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    ...fieldTextStyle,
    paddingLeft: 10,
    height: 40
  },
  buttonsWrapper: {
    alignSelf: 'stretch',
    paddingBottom: 3
  },
  validationErr: {
    color: 'red',
    fontFamily: Fonts.regular,
    fontSize: 14
  },
  fieldErrView: {
    borderColor: 'red',
  }
});
