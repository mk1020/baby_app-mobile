import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {NoteHeader} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {CreateNoteCard} from './CreateNoteCard';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../../navigation/types';
import {NavigationPages} from '../../../../navigation/pages';
import {Fonts} from '../../../../common/phone/fonts';

export enum NotePageMode {
  Edit = 'Edit',
  Create = 'Create'
}
type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.NotePage>
}
export const NotePage = memo((props: TProps) => {
  const {route} = props;

  const {mode, noteData} = route.params;

  const {t, i18n} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [imagesUri, setImagesUri] = useState<string[]>([]);

  useEffect(() => {
    if (route.params?.imagesUri) {
      setImagesUri(route.params?.imagesUri);
    }
  }, [route.params?.imagesUri]);

  const onPressOutside = () => {
    setModalVisible(false);
    return false;
  };

  const onLoadImage = (imageUri: string) => {
    setImagesUri([...imagesUri, imageUri]);
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
          <CreateNoteCard imagesUri={imagesUri}/>
        </View>
        <TouchableHighlight>
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
