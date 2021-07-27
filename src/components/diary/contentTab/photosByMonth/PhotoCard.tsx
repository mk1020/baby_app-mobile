import React, {memo} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../../common/phone/fonts';
import {ConditionView} from '../../../../common/components/ConditionView';
import {Images} from '../../../../common/imageResources';

type TProps = {
  image: string | null
  date: string
  onPress: ()=> void
}
const windowWidth = Dimensions.get('window').width;

export const PhotoCard = memo((props: TProps) => {
  const {image, date, onPress} = props;


  return (
    <TouchableHighlight underlayColor={'#969696'} onPress={onPress}>
      <View>
        <ImageBackground
          source={{uri: image || undefined}}
          style={styles.container}
        >
          <ConditionView showIf={!image}>
            <View style={styles.stubContainer}>
              <Image source={Images.cameraSmile} style={styles.stubImage}/>
            </View>
          </ConditionView>
          <View style={[styles.dateContainer, !image && styles.dateContainerEmpty]}>
            <Text style={[styles.date, !image && styles.dateEmptyCard]}>{date}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableHighlight>
  );
});
const styles = StyleSheet.create({
  container: {
    width: windowWidth / 3 - 4,
    height: windowWidth / 2.7,
    backgroundColor: 'rgb(230, 230, 230)',
    justifyContent: 'flex-end'
  },
  stubContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stubImage: {
    width: 70,
    height: 70,
    tintColor: '#fa6e00'
  },
  dateContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  dateContainerEmpty: {
    backgroundColor: 'transparent'
  },
  date: {
    fontFamily: Fonts.regular,
    color: '#fff',
    marginBottom: 3
  },
  dateEmptyCard: {
    fontFamily: Fonts.regular,
    color: '#000',
  }
});
