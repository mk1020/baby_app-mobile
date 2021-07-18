import React, {memo, useEffect, useState} from 'react';
import {Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {NoteHeader} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {NoteCard} from './NoteCard';
import {RouteProp} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../../navigation/types';
import {NavigationPages} from '../../../../navigation/pages';
import {Fonts} from '../../../../common/phone/fonts';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {INoteJS} from '../../../../model/types';
import {createNoteDB, updateNoteDB} from '../../assist';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {Controller, useForm} from 'react-hook-form';

export interface IFormNote extends INoteJS{
  imagesUri: string[]
}

export enum NotePageMode {
  Edit = 'Edit',
  Create = 'Create'
}
type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.NotePage>
}
export const NotePage = memo((props: TProps) => {
  const {route} = props;
  const {noteData, imagesUri = [], mode} = route.params;

  const {t, i18n} = useTranslation();
  const database = useDatabase();

  const [modalVisible, setModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm<IFormNote>({defaultValues: {...noteData, imagesUri}});

  useEffect(() => {
    if (imagesUri) {
      setValue('imagesUri', imagesUri);
    }
  }, [imagesUri]);
  console.log('getValues', getValues());
  console.log('imagesUri', imagesUri);
  const onPressOutside = () => {
    setModalVisible(false);
    return false;
  };

  const onLoadImage = (imageUri: string) => {
    const images = getValues('imagesUri');
    setValue('imagesUri', [...images, imageUri], {shouldValidate: true});
  };

  const onPressDone = async (data: UnpackNestedValue<IFormNote>) => {
    try {
      const _noteData:INoteJS = {
        ...data,
        photo: data.imagesUri?.join(';'),
      };
      if (mode === NotePageMode.Create && _noteData) {
        await createNoteDB(database, _noteData);
      } else {
        await updateNoteDB(database, _noteData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView
      style={styles.containerWrapper}
      onStartShouldSetResponder={onPressOutside}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <NoteHeader
            title={mode === NotePageMode.Create ? t('createNote') : t('editNote')}
            mode={mode}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            onLoadImage={onLoadImage}
          />
          <NoteCard formControl={control} noteData={getValues()} />
        </View>
        <TouchableHighlight onPress={handleSubmit(onPressDone)}>
          <View style={styles.buttonDone}>
            <Text style={styles.buttonDoneText}>{t('done')}</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  buttonDoneContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  buttonDone: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFA100',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
      },
      android: {
        elevation: 2,
      }
    }),
  },
  buttonDoneText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: '#ffffff',
    textTransform: 'uppercase'
  }
});
