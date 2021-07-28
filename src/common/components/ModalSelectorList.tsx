import React, {memo} from 'react';
import {Dimensions, FlatList, Image, ImageURISource, ListRenderItemInfo, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {Fonts} from '../phone/fonts';
import {Images} from '../imageResources';
import {ConditionView} from './ConditionView';

export type TModalDataItem = {
  title: string
  icon: ImageURISource
  check?: boolean
  onPress: ()=> void
}
type TProps = {
  data: TModalDataItem[]
  onRequestClose: () => void
  isVisible: boolean
}
export const ModalSelectorList = memo((props: TProps) => {
  const {isVisible, onRequestClose, data} = props;
  const {t} = useTranslation();

  const renderItem = ({item}: ListRenderItemInfo<TModalDataItem>) => {
    return (
      <SelectorListItem
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
        check={item?.check}
      />
    );
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.title + index}
            style={{maxHeight: 200}}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

    </Modal>
  );
});

const SelectorListItem = (props: TModalDataItem) => {
  const {check, icon, onPress, title} = props;
  return (
    <TouchableHighlight underlayColor={'#E5E5E5'} onPress={onPress}>
      <View style={styles.listItemContainer}>
        <View style={styles.listItemBase}>
          <Image source={icon} style={[styles.listItemImage, {tintColor: 'orange', marginRight: 10}]}/>
          <Text style={styles.listItemTitle}>{title}</Text>
        </View>
        <ConditionView showIf={!!check}>
          <Image source={Images.check} style={styles.listItemImage}/>
        </ConditionView>
      </View>
    </TouchableHighlight>
  );
};
const width =  Dimensions.get('window').width;
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flexDirection: 'row',
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width / 6
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  listItemImage: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  listItemTitle: {
    fontFamily: Fonts.medium,
    fontSize: 16
  },
  listItemBase: {
    flexDirection: 'row'
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 20
  }
});
