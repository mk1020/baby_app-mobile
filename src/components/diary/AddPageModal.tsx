import React, {memo, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {emailRegex} from '../../common/consts';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import DropDownPicker from 'react-native-dropdown-picker';
import {Fonts} from '../../common/phone/fonts';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

type TProps = {
  visible: boolean
  onRequestClose: ()=> void
  chapters: {diaryId: string, name: string, number: number, createdAt: number, updatedAt: number}[]
}
enum PageTypes {
  Photo = 'Photo',
  Common = 'Common',
  Sleep = 'Sleep'
}
interface IForm {
  pageType: PageTypes,
  pageName: string,
  pageChapter: string
}


export const AddPageModal = memo((props: TProps) => {
  const {t, i18n} = useTranslation();
  const {visible, onRequestClose, chapters} = props;

  const defaultItemsChapters = [
    {label: t('createNewChapter'), value: '0'},
    {label: t('withoutChapter'), value: '1'}
  ];
  const chaptersPikerItems = chapters.map(chapter => ({
    label: chapter.name, value: chapter.name
  }));
  defaultItemsChapters.push(...chaptersPikerItems);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>();


  const onPressAdd = (data: UnpackNestedValue<IForm>) => {

  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={styles.picker}
            textStyle={styles.pickerTextStyle}
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                placeholder={'Название Главы'}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name="email"
            rules={{required: true, pattern: emailRegex}}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                placeholder={'Название Страницы'}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name="email"
            rules={{required: true, pattern: emailRegex}}
            defaultValue=""
          />
          <TouchableHighlight onPress={handleSubmit(onPressAdd)}>
            <Text>Создать</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
});
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
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  picker: {
    backgroundColor: '#EBF6FA',
    borderWidth: 2,
    borderColor: '#41C3CD',
    borderStyle: 'solid',
    borderRadius: 10
  },
  pickerTextStyle: {
    fontSize: 18,
    lineHeight: 21,
    color: '#41C3CD',
    fontFamily: Fonts.bold,
    textTransform: 'capitalize'
  }
});
