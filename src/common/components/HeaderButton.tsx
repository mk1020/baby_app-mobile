import React, {memo} from 'react';
import {Image, ImageURISource, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

type TProps = {
  icon: ImageURISource
  onPress?: ()=> void
}

export const HeaderButton = memo((props: TProps) => {
  const {icon, onPress} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} >
        <Image source={icon} style={styles.icon}/>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowRadius: 10,
        shadowColor: 'rgba(65, 195, 205, 0.25)',
      },
      android: {
        elevation: 3,
      }
    }),

  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24
  }
});
