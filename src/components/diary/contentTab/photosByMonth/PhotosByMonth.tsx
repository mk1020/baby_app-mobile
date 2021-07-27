import React, {memo} from 'react';
import {FlatList, ListRenderItemInfo, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {IPhoto} from '../../../../model/types';
import {PhotoCard} from './PhotoCard';
import {monthByNum} from '../../assist';
import {useTranslation} from 'react-i18next';
import {Months} from '../../Page/PagePeriodMonth';

type TProps = {
  onPressAddPhoto: (photo: IPhoto)=>void
  onPressPhoto: (photo: IPhoto)=>void
  renderData: IPhoto[][]
}
export const PhotosByMonth = memo((props: TProps) => {
  const {onPressAddPhoto, onPressPhoto, renderData} = props;

  const {t} = useTranslation();
  console.log('render');

  const renderItem = (item: ListRenderItemInfo<IPhoto[]>) => {
    return (
      <View style={styles.rowCards}>
        {
          item.item.map((photo, index) => {
            const date = new Date(photo?.date);
            const month = date.getMonth() as Months;
            const year = date.getFullYear();
            return (
              <PhotoCard
                image={photo.photo}
                date={`${monthByNum(t)[month]}, ${year}`}
                key={photo.id + index.toString()}
                onPress={() => (photo.photo ? onPressPhoto(photo) : onPressAddPhoto(photo))}
              />
            );
          })
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'rgb(236,157,36)'} />
      <FlatList
        data={renderData}
        renderItem={renderItem}
        keyExtractor={item => (item?.length ? item[0].id : '123')}
      />
    </SafeAreaView>
  );
});


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(244, 244, 236)',
    flex: 1
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  }
});
