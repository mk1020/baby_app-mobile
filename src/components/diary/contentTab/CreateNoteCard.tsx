import React, {memo, useMemo} from 'react';
import {Image, ImageSourcePropType, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {dateFormat} from '../assist';
import {Controller, useForm} from 'react-hook-form';
import {emailRegex} from '../../../common/consts';
import {useTranslation} from 'react-i18next';
import {ImagesSlider} from '../../../common/components/ImagesSlider/ImagesSlider';
import {ConditionView} from '../../../common/components/ConditionView';

interface IForm {
  title: string
  note: string
}
type TProps = {
  imagesUri: string[]
}
export const CreateNoteCard = memo((props: TProps) => {
  const {imagesUri = []} = props;
  const {t, i18n} = useTranslation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.title}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder={t('noteTitle')}
            placeholderTextColor={'rgba(144,133,133,0.5)'}
          />
        )}
        name="title"
        rules={{required: true}}
        defaultValue=""
      />
      <ConditionView showIf={imagesUri.length > 0}>
        <ImagesSlider
          imagesUri={imagesUri}
        />
      </ConditionView>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.noteText}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder={t('typeText')}
            placeholderTextColor={'rgba(144,133,133,0.5)'}
          />
        )}
        name="note"
        rules={{required: true}}
        defaultValue=""
      />
      <Text style={styles.date}>{dateFormat(new Date().getTime())}</Text>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowRadius: 10,
        shadowColor: 'rgba(49, 160, 178, 0.25)',
      },
      android: {
        elevation: 3,
      }
    }),
  },
  noteText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'red',
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#5a5757'
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: '#41C3CD',
  },
  date: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#BAC0CF',
    alignSelf: 'flex-end',
    marginTop: 6
  }
});
