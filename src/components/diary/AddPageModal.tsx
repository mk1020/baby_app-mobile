import React, {memo, useState} from 'react';
import {StyleSheet, Text, TextInput, TextStyle, TouchableHighlight, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {emailRegex, inputsRegex} from '../../common/consts';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import DropDownPicker from 'react-native-dropdown-picker';
import {Fonts} from '../../common/phone/fonts';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {ConditionView} from '../../common/components/ConditionView';
import {getItemsPageType} from './assist';
import {Space} from '../../common/components/Space';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {ChaptersTableName, DiaryTableName, PagesTableName} from '../../model/schema';
import {createPage, createPageAndChapter} from '../../model/assist';

type TProps = {
  onRequestClose: ()=> void
  diaryId: string
  chapters?: {diaryId: string, name: string, number: number, createdAt: number, updatedAt: number}[]
}

export interface IFormCretePage {
  pageType: number,
  pageName: string,
  newChapter: string
  selectedChapter: number
}


export const AddPageModal = memo((props: TProps) => {
  const {t, i18n} = useTranslation();
  const {onRequestClose, chapters = [], diaryId} = props;

  const defaultItemsChapters = [
    {label: t('createNewChapter'), value: 0}, //0 - создание главы
    {label: t('withoutChapter'), value: 1} //1 - без главы
  ];
  const chaptersPikerItems = chapters.map(chapter => ({
    label: chapter.name, value: chapter.name
  }));

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm<IFormCretePage>();

  const [openChapterPicker, setOpenChapterPicker] = useState(false);
  const [chapterItems, setChapterItems] = useState([...defaultItemsChapters, ...chaptersPikerItems]);

  const [openPageTypePicker, setOpenPageTypePicker] = useState(false);
  const [pageTypeItems, setPageTypeItems] = useState(getItemsPageType(t));

  const database = useDatabase();

  const onPressAdd = async (data: UnpackNestedValue<IFormCretePage>) => {
    try {
      const chaptersCount = await database?.get(DiaryTableName).query().fetchCount();
      if (data.selectedChapter === 0) { // 0 - значение стандартного элемента в выпадающем списке. Означает "Создать главу"
        createPageAndChapter(database, data, diaryId, chaptersCount + 1).then();
      } else {
        createPage(database, data, diaryId).then();
      }

    } catch (e) {
      console.error(e);
    }
  };
  console.log(errors);
  return (
    <Modal
      isVisible={true}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
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
                listMode={'MODAL'}
                modalProps={{
                  animationType: 'fade'
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
                  <View style={styles.inputWrapper}>
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
              <View style={styles.inputWrapper}>
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
          <Space.V px={16} />

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <DropDownPicker
                open={openPageTypePicker}
                value={value}
                items={pageTypeItems}
                setOpen={setOpenPageTypePicker}
                setValue={callback => onChange(callback(value))}
                setItems={setPageTypeItems}
                style={styles.picker}
                textStyle={styles.pickerTextStyle}
                placeholder={t('pageType')}
                listMode={'MODAL'}
                modalProps={{
                  animationType: 'fade'
                }}
                //flatListProps={{pointerEvents: 'box-none'}}
              />
            )}
            name="pageType"
            rules={{required: true}}
            defaultValue={null}
          />
          <Space.V px={16} />

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity >
              <Text style={styles.buttonCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <Space.H px={24}/>
            <TouchableOpacity  onPress={handleSubmit(onPressAdd)}>
              <Text style={styles.buttonAddText}>{t('done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});
//todo переделать под страницу с прозрачным фоном...
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
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
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
    paddingLeft: 10
  },
  buttonsWrapper: {
    marginTop: 50,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  buttonAddText: {
    color: '#41C3CD',
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },
  buttonCancelText: {
    color: '#BAC0CF',
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  }
});
