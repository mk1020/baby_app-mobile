import React, {memo, useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {NoteHeader} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {NoteCard} from './NoteCard';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../../navigation/pages';
import {Fonts} from '../../../../common/phone/fonts';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {INoteJS} from '../../../../model/types';
import {UnpackNestedValue} from 'react-hook-form/dist/types/form';
import {useForm} from 'react-hook-form';
import {createNoteDB, deleteNote, updateNoteDB} from '../../../../model/assist';
import {RootStackList} from '../../../../navigation/types';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {ConditionView} from '../../../../common/components/ConditionView';

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
  const {noteData, imagesUri = [], mode, pageId} = route.params;

  const {t, i18n} = useTranslation();
  const database = useDatabase();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm<IFormNote>({defaultValues: {imagesUri, ...noteData}});
  const editorRef = useRef<RichEditor>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  console.log(getValues())
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (imagesUri) {
      setValue('imagesUri', imagesUri);
    }
  }, [imagesUri]);

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
      if (mode === NotePageMode.Create && pageId) {
        await createNoteDB(database, _noteData, pageId);
        navigation.goBack();
      } else {
        await updateNoteDB(database, _noteData);
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPressDelete = async () => {
    try {
      await deleteNote(getValues('id'), database);
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
    <SafeAreaView
      style={styles.containerWrapper}
      onStartShouldSetResponder={onPressOutside}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <NoteHeader
            title={mode === NotePageMode.Create ? t('createNote') : t('editNote')}
            mode={mode}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            onLoadImage={onLoadImage}
            onPressDelete={onPressDelete}
          />
          <NoteCard
            formControl={control}
            noteData={getValues()}
            onCursorPosition={onCursorPosition}
            editorRef={editorRef}
          />
        </View>
        <TouchableHighlight
          onPress={handleSubmit(onPressDone)}
          underlayColor={'#c67200'}
          style={styles.buttonDoneWrapper}
        >
          <View style={styles.buttonDone}>
            <Text style={styles.buttonDoneText}>{t('done')}</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
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
    backgroundColor: '#ffffff',
    flex: 1
  },
  container: {
    justifyContent: 'space-between'
  },
  buttonDoneContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  buttonDoneWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 28,
  },
  buttonDone: {
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
