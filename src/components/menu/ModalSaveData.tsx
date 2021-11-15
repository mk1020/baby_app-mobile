import {ModalDown} from '../../common/components/ModalDown';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {memo, useState} from 'react';
import {Fonts} from '../../common/phone/fonts';
import {ConditionView} from '../../common/components/ConditionView';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {RootStoreType} from '../../redux/rootReducer';
import {SyncWithServer} from './IntegrationWithInternet/SyncWithServer';
import {ExportToGoogle} from './IntegrationWithInternet/ExportToGoogle';
import {ImportFromGoogle} from './IntegrationWithInternet/ImportFromGoogle';

type SaveProps = {
    color: string
    highlightColor: string
    title: string
    handler: () => void
    errStyle?: boolean
}

const SaveModalItem = ({title, handler, color, highlightColor, errStyle}: SaveProps) => {
  const errorStyle = {borderWidth: 3, borderColor: 'red'};
  return (
    <TouchableHighlight style={[styles.container, {backgroundColor: color}, errStyle && errorStyle]}
      onPress={handler} underlayColor={highlightColor}>
      <View style={{padding: 8}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: 16}}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};


type Props = {
    onModalCloseRequest: () => void
    isVisible: boolean
    database: any;
}
export const ModalSaveData = memo((props: Props) => {
  const {isVisible, onModalCloseRequest, database} = props;
  const {t, i18n} = useTranslation();
  const userToken = useSelector((state: RootStoreType) => state.app.userToken);

  const [exportToGoogleStared, setExportToGoogleStarted] = useState(false);
  const [importFromGoogleStared, setImportFromGoogleStarted] = useState(false);
  const [syncServerStared, setSyncServerStarted] = useState(false);

  const onPressSync = () => {
    setSyncServerStarted(true);
  };
  const onPressUploadGoogle = () => {
    setExportToGoogleStarted(true);
  };
  const onPressDownloadGoogle = () => {
    setImportFromGoogleStarted(true);
  };
  const closeModalsHandler = () => {
    onModalCloseRequest();
    setImportFromGoogleStarted(false);
    setExportToGoogleStarted(false);
    setSyncServerStarted(false);
  };

  return (
    <ModalDown
      onBackdropPress={closeModalsHandler}
      onBackButtonPress={closeModalsHandler}
      isVisible={isVisible}
    >
      <>
        <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
          <View>
            <SaveModalItem
              title={t('syncWithServer')}
              handler={onPressSync}
              color={'#ffb300'}
              highlightColor={'#c68400'}
              errStyle={syncServerStared && !userToken}
            />
          </View>
          <View>
            <SaveModalItem
              title={t('uploadToGoogle')}
              handler={onPressUploadGoogle}
              color={'#64dd17'}
              highlightColor={'#1faa00'}
            />
            <SaveModalItem
              title={t('getFromGoogle')}
              handler={onPressDownloadGoogle}
              color={'#039be5'}
              highlightColor={'#006db3'}
            />
          </View>
          <ConditionView showIf={syncServerStared && !userToken}>
            <Text style={styles.authErr}>{t('unAuthSync')}</Text>
          </ConditionView>
        </View>

        <SyncWithServer
          onModalCloseRequest={closeModalsHandler}
          isVisible={syncServerStared && !!userToken}
          database={database}
        />
        <ExportToGoogle
          onModalCloseRequest={closeModalsHandler}
          isVisible={exportToGoogleStared}
          database={database}
        />
        <ImportFromGoogle
          onModalCloseRequest={closeModalsHandler}
          isVisible={importFromGoogleStared}
          database={database}
        />
      </>
    </ModalDown>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
  authErr: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
  },
  successContainer: {
    marginTop: 28
  },
  doneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'
  },
});
