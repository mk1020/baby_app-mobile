import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {NoteHeader, NoteHeaderType} from './NoteHeader';
import {useTranslation} from 'react-i18next';
import {CreateNoteCard} from './CreateNoteCard';

type TProps = {

}
export const CreateNote = memo((props: TProps) => {
  const {} = props;
  const {t, i18n} = useTranslation();

  return (
    <>
      <NoteHeader
        title={t('createNote')}
        headerFor={NoteHeaderType.Create}
      />
      <CreateNoteCard/>
    </>
  );
});
const styles = StyleSheet.create({});
