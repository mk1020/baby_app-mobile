import React, {memo, useMemo} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView, ScrollView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import {CardUser} from './CardUser';
import {Section, TMenuItem} from './assist';
import {MenuItem} from './MenuItem';
import {Fonts} from '../../common/phone/fonts';
import {ConditionView} from '../../common/components/ConditionView';
import {Space} from '../../common/components/Space';
import {useTranslation} from 'react-i18next';

type TProps = {
  renderData: Section[]
}

const SectionHeader = ({title}: {title: string}) => {
  return (
    <Text style={styles.sectionHeaderText}>{title}</Text>
  );
};
export const Menu = memo((props: TProps) => {
  const {renderData} = props;
  const {t} = useTranslation();

  const renderItems = useMemo(() => {
    return renderData.map((section, index) => (
      <View style={styles.sectionContainer} key={index.toString() + 'section'}>
        {section.title ? <SectionHeader title={section.title} /> : <Space.V px={40}/>}
        <View style={styles.section}>
          {
            section.data.map((menuItem, index) => (
              <MenuItem
                title={menuItem.title}
                subTitle={menuItem?.subTitle}
                icon={menuItem.icon}
                onPress={menuItem.onPress}
                iconTintColor={menuItem.iconTintColor}
                key={menuItem.title + index}
              />
            ))
          }
        </View>
      </View>
    ));
  }, [renderData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      >
        <CardUser email={'mmmffjs7438g@gmail.com'} lastSyncAt={'27 июл. 18:42'}/>
        {renderItems}
        <TouchableOpacity style={styles.buttonExit} hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
          <Text style={styles.buttonExitText}>{t('exit')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(244, 244, 236)',
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8
  },
  flatListContainer: {
    paddingBottom: 24
  },
  sectionHeaderText: {
    color: 'rgb(122, 121, 116)',
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
    marginLeft: 16
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 8
  },
  sectionContainer: {},
  buttonExit: {
    marginTop: 8,
    alignSelf: 'center',
  },
  buttonExitText: {
    fontFamily: Fonts.bold,
    color: 'red',
    fontSize: 16,
  },
});
