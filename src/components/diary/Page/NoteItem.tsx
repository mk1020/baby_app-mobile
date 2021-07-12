import React, {memo} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';

type TProps = {
  title: string
  text: string
  date: number
}
export const NoteItem = memo((props: TProps) => {
  const {title, text, date} = props;

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.noteText} numberOfLines={3} ellipsizeMode={'tail'}>{text}</Text>
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
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
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#383838'
  },
  title: {
    fontFamily: Fonts.regular,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19,
    color: '#41C3CD',
    marginBottom: 13
  },
  date: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#BAC0CF',
  }
});
