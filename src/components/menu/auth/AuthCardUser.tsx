import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';
import {useTranslation} from 'react-i18next';
import {ConditionView} from '../../../common/components/ConditionView';

type TProps = {
   email: string
   lastSyncAt: string
}
export const AuthCardUser = memo((props: TProps) => {
  const {email, lastSyncAt} = props;
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image source={Images.user} style={styles.imageAccount}/>
      <Text style={styles.email}>{email}</Text>
      <ConditionView showIf={!!lastSyncAt}>
        <Text style={styles.lastSync}>{t('lastSync')}: {lastSyncAt}</Text>
      </ConditionView>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
  },
  imageAccount: {
    height: 48,
    width: 48,
    tintColor: '#FFA100'
  },
  email: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginTop: 5
  },
  lastSync: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#31A0B2'
  },
});
