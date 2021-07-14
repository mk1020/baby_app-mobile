import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {CreateNoteHeader} from './CreateNoteHeader';
import {useTranslation} from 'react-i18next';

type TProps = {

}
export const CreateNote = memo((props: TProps) => {
  const {} = props;
  const {t, i18n} = useTranslation();

  return (
    <>
      <CreateNoteHeader title={t('createNote')}/>
    </>
  );
});
const styles = StyleSheet.create({});
