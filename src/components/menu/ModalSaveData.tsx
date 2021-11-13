import {ModalDown} from '../../common/components/ModalDown';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {Dispatch, memo, SetStateAction, useEffect, useState} from 'react';
import {Fonts} from '../../common/phone/fonts';
import {ProcessType, Progress, ProgressActions} from './MenuContainer';
import {ConditionView} from '../../common/components/ConditionView';
import {ModalProgressContent, ProgressState} from '../../common/components/ModalDownProgress';
import {useTranslation} from 'react-i18next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {oAuthGoogle} from '../../redux/appSlice';
import {syncDB} from '../../model/remoteSave/sync';
import {Database} from '@nozbe/watermelondb';
import {signInGoogle} from './assist';
import {downloadFromGoogle, saveInGoogleDrive} from '../../model/remoteSave/google';
import {DownloadProgressCallbackResult} from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {RootStoreType} from '../../redux/rootReducer';
import {TFunction} from 'i18next';
import {emailRegex} from "../../common/consts";

type SaveProps = {
    color: string
    highlightColor: string
    title: string
    handler: () => void
    errStyle?: boolean
}
type SuccessProps = {
    successText: string
    successSecondText: string
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
const SaveSuccess = (props: SuccessProps) => {
    return (
        <View style={styles.successContainer}>
            <Text style={styles.doneText}>{props.successText}</Text>
            <Text style={styles.doneText}>{props.successSecondText}</Text>
        </View>
    );
};

export enum SyncActions {
    Download = 'Download',
    Upload = 'Upload',
    Other = 'Other'
}

const progressSubtitle = (t: TFunction) => ({
    [ProgressActions.Download]: t('loading'),
    [ProgressActions.Zip]: t('waitPlease'),
    [ProgressActions.Upload]: t('uploadPhotos'),
    [SyncActions.Download]: t('downloadPhotos'),
    [SyncActions.Upload]: t('uploadPhotos'),
    [SyncActions.Other]: t('waitPlease')
});
export type SyncProgress = {
    totalFiles: number
    processedFiles: number
    state: ProgressState
    action: SyncActions
}
type Props = {
    onModalCloseRequest: () => void
    isVisible: boolean
    progress: Progress
    database: any;
    setProgress: Dispatch<SetStateAction<Progress>>
}
export const ModalSaveData = memo((props: Props) => {
    const {isVisible, onModalCloseRequest, progress, database, setProgress} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const userToken = useSelector((state: RootStoreType) => state.app.userToken);
    const userId = useSelector((state: RootStoreType) => state.app.userId);
    const deletedPhotos = useSelector((state: RootStoreType) => state.app.deletedPhotos);
    const diaryId = useSelector((state: RootStoreType) => state.app.diaryId);

    const [syncProgress, setSyncProgress] = useState<SyncProgress>({
        totalFiles: 1,
        processedFiles: 0,
        state: ProgressState.None,
        action: SyncActions.Other
    });

    const onPressSync = async () => {
        setSyncProgress({
            totalFiles: 1,
            processedFiles: 0,
            state: ProgressState.InProgress,
            action: SyncActions.Other
        });
    };

    useEffect(() => {
        (async () => {
            if (userToken?.token && userId &&
                syncProgress.state === ProgressState.InProgress) {
                await syncDB(database, userToken, userId, deletedPhotos, dispatch,
                    (total = 1, processed: number, action: SyncActions) => {
                        setSyncProgress({
                            totalFiles: total,
                            processedFiles: processed,
                            action,
                            state: ProgressState.InProgress
                        });
                    }).catch(console.log);
                setSyncProgress({
                    totalFiles: 1,
                    processedFiles: 1,
                    action: SyncActions.Other,
                    state: ProgressState.Success
                });
                console.log('sync finish!');
            }
        })();
    }, [userToken?.token, userId, syncProgress.state]);

    const onPressUploadGoogle = async () => {
        try {
            setSyncProgress({
                totalFiles: 1,
                processedFiles: 0,
                state: ProgressState.None,
                action: SyncActions.Other
            });

            await GoogleSignin.hasPlayServices().catch();
            const accessToken = await signInGoogle();
            await saveInGoogleDrive(database as Database, accessToken,
                (loadedMB, totalMB) => {
                    console.log('total', totalMB);
                    console.log('loadedMB', loadedMB);
                    setProgress({
                        state: loadedMB !== totalMB ? ProgressState.InProgress : ProgressState.Success,
                        progress: loadedMB / totalMB,
                        action: ProgressActions.Upload,
                        processType: ProcessType.Push
                    });
                });
            await GoogleSignin.revokeAccess().catch();

        } catch (e) {
            console.log('errror', e)
            setProgress({
                state: ProgressState.Error,
                progress: 0,
                action: ProgressActions.Other,
                processType: null
            });
        }
    };

    const onPressDownloadGoogle = async () => {
        try {
            setSyncProgress({
                totalFiles: 1,
                processedFiles: 0,
                state: ProgressState.None,
                action: SyncActions.Other
            });
            setProgress({
                state: ProgressState.InProgress,
                progress: 0,
                action: ProgressActions.Other,
                processType: null
            });
            const accessToken = await signInGoogle();
            await GoogleSignin.hasPlayServices();
            await downloadFromGoogle(accessToken, database as Database,
                ({bytesWritten, contentLength}: DownloadProgressCallbackResult) => {
                    setProgress({
                        state: bytesWritten !== contentLength ? ProgressState.InProgress : ProgressState.Success,
                        progress: bytesWritten / contentLength,
                        action: ProgressActions.Download,
                        processType: ProcessType.Pull
                    });
                });
        } catch (e) {
            setProgress({
                state: ProgressState.Error,
                progress: 0,
                action: ProgressActions.Other,
                processType: null
            });
        }
    };

    const modalCloseHandler = () => {
        onModalCloseRequest();
        setSyncProgress({
            totalFiles: 1,
            processedFiles: 0,
            state: ProgressState.None,
            action: SyncActions.Other
        });
    };

    console.log(syncProgress)
    console.log(progress)
    return (
        <ModalDown
            onBackdropPress={modalCloseHandler}
            onBackButtonPress={modalCloseHandler}
            isVisible={isVisible}
        >
            <>
                <ConditionView showIf={progress.state === ProgressState.None}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <View>
                            <SaveModalItem
                                title={'Fast sync with server'}
                                handler={onPressSync}
                                color={'#ffb300'}
                                highlightColor={'#c68400'}
                                errStyle={syncProgress.state === ProgressState.InProgress && !userToken}
                            />
                        </View>
                        <View>
                            <SaveModalItem
                                title={'Upload all on Google'}
                                handler={onPressUploadGoogle}
                                color={'#64dd17'}
                                highlightColor={'#1faa00'}
                            />
                            <SaveModalItem
                                title={'Get from Google'}
                                handler={onPressDownloadGoogle}
                                color={'#039be5'}
                                highlightColor={'#006db3'}
                            />
                        </View>
                        <ConditionView showIf={syncProgress.state === ProgressState.InProgress && !userToken}>
                            <Text style={styles.authErr}>{t('unAuthSync')}</Text>
                        </ConditionView>
                    </View>
                </ConditionView>

                <ConditionView showIf={
                    progress.state !== ProgressState.None ||
                    syncProgress.state !== ProgressState.None && !!userToken
                }>
                    <ModalProgressContent
                        state={syncProgress.state !== ProgressState.None ? syncProgress.state : progress.state}
                        progress={syncProgress.state !== ProgressState.None ?
                            syncProgress.processedFiles / syncProgress.totalFiles : progress.progress
                        }
                        title={t('execution')}
                        subtitle={progressSubtitle(t)[syncProgress.state !== ProgressState.None ? syncProgress.action : progress.action]}
                        SuccessComponent={
                            progress.action === ProgressActions.Zip &&
                            progress.processType === ProcessType.Pull ||
                            progress.action === ProgressActions.Download &&
                            progress.processType === ProcessType.Push ||
                            progress.action === ProgressActions.Upload &&
                            progress.processType === ProcessType.Push ||
                            syncProgress.state === ProgressState.Success ?
                                (
                                    <SaveSuccess
                                        successText={t('allReady')}
                                        successSecondText={t('haveNiceDay')}
                                    />
                                ) : null
                        }
                        ErrorComponent={
                            <Text style={styles.errorText}>{t('oops')}</Text>
                        }
                    />
                </ConditionView>
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