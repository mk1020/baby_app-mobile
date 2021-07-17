import React, {memo, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {NoteHeader, NoteHeaderType} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {CreateNoteCard} from './CreateNoteCard';

type TProps = {

}
export const CreateNote = memo((props: TProps) => {
  const {} = props;
  const {t, i18n} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [imagesUri, setImagesUri] = useState<string[]>([]);

  const onPressOutside = () => {
    setModalVisible(false);
    return false;
  };

  const onLoadImage = (imageUri: string) => {
    setImagesUri([...imagesUri, imageUri]);
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={onPressOutside}
    >
      <NoteHeader
        title={t('createNote')}
        headerFor={NoteHeaderType.Create}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        onLoadImage={onLoadImage}
      />
      <CreateNoteCard imagesUri={imagesUri}/>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  }
});
