import React, {memo} from 'react';
import {Image, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Images} from '../../../../common/imageResources';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../../navigation/pages';
import {RootStackList} from '../../../../navigation/types';
import {HeaderButtonSimple} from '../../../../common/components/HeaderButtonSimple';
import {HeaderBackButton} from '@react-navigation/stack';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {PhotosTableName} from '../../../../model/schema';
import {getClearPathFile} from '../../../../common/assistant/files';
import * as RNFS from 'react-native-fs';

type TProps = {
  route: RouteProp<RootStackList, NavigationPages.ImageFullScreen>
}
export const ImageFullScreen = memo((props: TProps) => {
  const {route} = props;

  const {imageUri, imageId} = route.params;

  const navigation = useNavigation();
  const db = useDatabase();

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressDelete = async () => {
    try {
      const image = await db.get(PhotosTableName).find(imageId || '');
      // @ts-ignore
      await image.updatePhoto(null);
      await RNFS.unlink(getClearPathFile(imageUri));
      navigation.navigate(NavigationPages.PhotosByMonth, {deletedPhotoId: imageId});
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <View style={styles.header}>
        <HeaderBackButton tintColor={'#fff'} onPress={onPressBack}/>
        <HeaderButtonSimple icon={Images.delete} onPress={onPressDelete}/>
      </View>
      <Image source={{uri: imageUri}} style={styles.image} resizeMode={'contain'}/>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingVertical: 8,
    backgroundColor: 'rgb(254,183,77)'
  },
  image: {
    flex: 1
  }
});
