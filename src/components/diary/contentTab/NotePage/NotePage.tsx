import React, {memo, useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {NoteHeader} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {NoteCard} from './NoteCard';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../../navigation/pages';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {INoteJS} from '../../../../model/types';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {Controller, useForm} from 'react-hook-form';
import {createNoteDB, deleteImagesFromCache, deleteNote, updateNoteDB} from '../../../../model/assist';
import {RootStackList} from '../../../../navigation/types';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {ConditionView} from '../../../../common/components/ConditionView';
import {useKeyboard} from '../../../../common/hooks/useKeyboard';
import {ButtonFilled, ButtonModes} from '../../../../common/components/ButtonFilled';
import {Space} from '../../../../common/components/Space';
import {useDispatch} from 'react-redux';
import {addDeletedPhotos} from '../../../../redux/appSlice';

export interface IFormNote extends INoteJS{
  imagesUri: string[]
}

export enum NotePageMode {
  Edit = 'Edit',
  Create = 'Create'
}
type TProps = {
  route: RouteProp<RootStackList, NavigationPages.NotePage>
}
export const NotePage = memo((props: TProps) => {
  const {route} = props;
  const {
    noteData,
    imagesUri = [],
    mode,
    relations,
    deletedImagesUri = []
  } = route.params;

  const {t, i18n} = useTranslation();
  const database = useDatabase();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm<IFormNote>({defaultValues: noteData});
  const editorRef = useRef<RichEditor>(null);
  const {isKeyboardVisible} = useKeyboard();
  const dispatch = useDispatch();

  useEffect(() => {
    if (deletedImagesUri.length) {
      setValue('imagesUri', imagesUri, {shouldValidate: true});
    }
  }, [deletedImagesUri.length]);

  const onPressDone = async (data: UnpackNestedValue<IFormNote>) => {
    try {
      const _noteData:INoteJS = {
        ...data,
        photo: data.imagesUri?.join(';'),
      };

      if (mode === NotePageMode.Create) {
        await createNoteDB(database, _noteData, relations);
        navigation.goBack();
      }

      if (mode === NotePageMode.Edit) {
        await updateNoteDB(database, _noteData);
        deleteImagesFromCache(deletedImagesUri);
        navigation.goBack();
      }
      dispatch(addDeletedPhotos(deletedImagesUri));
    } catch (e) {
      console.log(e);
    }
  };

  const onPressDelete = async () => {
    try {
      await deleteNote(getValues('id'), database);
      const imagesUri = getValues('imagesUri');
      deleteImagesFromCache(imagesUri);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };
  const scrollRef = useRef<ScrollView>(null);

  const onCursorPosition = (offsetY: number) => {
    scrollRef?.current?.scrollTo({y: offsetY - 30, animated: true});
  };

  const getEditor = (): RichEditor => {
    return editorRef?.current as RichEditor;
  };

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
      >
        <View>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <NoteHeader
                title={mode === NotePageMode.Create ? t('createNote') : t('editNote')}
                mode={mode}
                onLoadImage={(imageUri: string) => {
                  setValue('imagesUri', [...value, imageUri], {shouldValidate: true});
                }}
                onPressDelete={onPressDelete}
              />
            )}
            name="imagesUri"
            rules={{required: false}}
            defaultValue={[]}
          />
          <NoteCard
            formControl={control}
            noteData={getValues()}
            onCursorPosition={onCursorPosition}
            editorRef={editorRef}
          />
        </View>

      </ScrollView>

      <ButtonFilled
        title={t('done')}
        mode={ButtonModes.Positive}
        onPress={handleSubmit(onPressDone)}
      />
      <Space.V px={16}/>
      <ConditionView showIf={isKeyboardVisible}>
        <RichToolbar
          editor={editorRef}
          actions={[
            actions.undo,
            actions.setBold,
            actions.setItalic,
            actions.setStrikethrough,
            actions.line,
            actions.redo,
          ]}
          getEditor={getEditor() ? getEditor : undefined}
          selectedIconTint={'red'}
          style={{backgroundColor: '#fff', alignItems: 'center'}}
        />
      </ConditionView>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: 'rgb(244, 244, 236)',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
  },
});
