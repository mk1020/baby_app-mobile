import React, {memo, useMemo} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AuthCardUser} from './auth/AuthCardUser';
import {Section} from './assist';
import {MenuItem} from './MenuItem';
import {Fonts} from '../../common/phone/fonts';
import {ConditionView} from '../../common/components/ConditionView';
import {Space} from '../../common/components/Space';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {UnAuthCardUser} from './auth/UnAuthCardUser';
import {dateFormat} from '../../common/assistant/date';
import {Images} from '../../common/imageResources';
import {commonAlert} from '../../common/components/CommonAlert';
import {signOut} from '../../redux/appSlice';
import {ProgressState} from '../../common/components/ModalDownProgress';

type TProps = {
  renderData: Section[]
  isAuth: boolean
  diaryId: string
  lastSyncedAt: number
  email: string
  isAuthError: boolean
}

const SectionHeader = ({title}: {title: string}) => {
  return (
    <Text style={styles.sectionHeaderText}>{title}</Text>
  );
};
export const Menu = memo((props: TProps) => {
  const {renderData, isAuth, diaryId, lastSyncedAt, email, isAuthError} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch();

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

  const onPressLogOut = () => {
    commonAlert(t, t('exitAlert'), t('exitMassage'), () => dispatch(signOut()));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <SectionHeader title={t('account')} />
          <View style={styles.section}>
            <ConditionView showIf={!isAuth}>
              <>
                <UnAuthCardUser diaryId={diaryId}/>
                <ConditionView showIf={isAuthError}>
                  <Text style={styles.authErr}>{t('authUnavailable')}</Text>
                </ConditionView>
              </>
            </ConditionView>
            <ConditionView showIf={isAuth}>
              <View>
                <AuthCardUser
                  email={email}
                  lastSyncAt={lastSyncedAt ? dateFormat(lastSyncedAt, true) : ''}
                />
                <TouchableOpacity style={styles.exitContainer} onPress={onPressLogOut}>
                  <Image source={Images.exit} style={styles.exitIcon}/>
                </TouchableOpacity>
              </View>
            </ConditionView>
          </View>
        </View>
        {renderItems}
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
  exitContainer: {
    position: 'absolute',
    right: 15,
    top: -12,
    zIndex: 1,
  },
  authErr: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
  exitIcon: {
    width: 64,
    height: 64
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
    paddingVertical: 8,
  },
  sectionContainer: {},
});
