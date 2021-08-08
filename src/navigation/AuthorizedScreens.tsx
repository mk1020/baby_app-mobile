import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationPages, NavigationTabs, TabsName} from './pages';
import {Diary} from '../components/diary/Diary';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {Page} from '../components/diary/Page/Page';
import {HeaderButton} from '../common/components/HeaderButton';
import {Images} from '../common/imageResources';
import {stylesHeader} from '../components/diary/Header';
import {NotePage, NotePageMode} from '../components/diary/contentTab/NotePage/NotePage';
import {ImagesFullScreenEdit} from '../components/diary/contentTab/NotePage/ImagesFullScreenEdit';
import {ImagesFullScreen} from '../components/diary/Page/ImagesFullScreen';
import {RootStackList, TabsList} from './types';
import {Menu} from '../components/menu/Menu';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet} from 'react-native';
import {Fonts} from '../common/phone/fonts';
import {ImageFullScreen} from '../components/diary/contentTab/photosByMonth/ImageFullScreen';
import {PhotosByMonthContainer} from '../components/diary/contentTab/photosByMonth/PhotosByMonthContainer';
import {Service} from '../components/menu/Service';
import {MenuContainer} from '../components/menu/MenuContainer';

const Tabs = createBottomTabNavigator<TabsList>();
const TabsNav = () => {
  return (
    <Tabs.Navigator tabBarOptions={{showLabel: false}}>
      <Tabs.Screen
        name={NavigationTabs.Diary}
        component={Diary}
        options={
          {tabBarIcon: (props: {
            focused: boolean;
            color: string;
            size: number;
          }) => <Image source={Images.openBook} style={{width: 48, height: 48, tintColor: props.focused ? '#FFA100' : '#000'}}/>,
          }
        }
      />
      <Tabs.Screen
        name={NavigationTabs.Menu}
        component={MenuContainer}
        options={
          {tabBarIcon: (props: {
              focused: boolean;
              color: string;
              size: number;
            }) => <Image source={Images.menu} style={{width: 36, height: 36, tintColor: props.focused ? '#FFA100' : '#000'}}/>,
          }
        }
      />
      <Tabs.Screen name={NavigationTabs.Service} component={Service} options={
        {tabBarIcon: (props: {
            focused: boolean;
            color: string;
            size: number;
          }) => <Image source={Images.cloudSync} style={{width: 36, height: 36, tintColor: props.focused ? '#FFA100' : '#000'}}/>,
        }
      }/>
    </Tabs.Navigator>
  );
};

const RootStack = createStackNavigator<RootStackList>();
export const AuthorizedScreens = (): JSX.Element => {
  const {t} = useTranslation();

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={TabsName}
        component={TabsNav}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationPages.DiaryPage}
        component={Page}
        options={({route, navigation}) => ({
          title: route?.params?.pageData?.name,
          headerLeft: () => <HeaderButton icon={Images.arrowBack} onPress={() => navigation.goBack()}/>,
          headerTitleStyle: stylesHeader.title,
          headerRight: () =>  (
            <HeaderButton icon={Images.add} onPress={() => {
              navigation.navigate(NavigationPages.NotePage, {
                mode: NotePageMode.Create,
                relations: {
                  pageId: route.params?.pageData?.id,
                  diaryId: route.params?.pageData?.diaryId,
                  chapterId: route.params?.pageData?.chapterId,
                }
              });
            }}
            />
          ),
          headerLeftContainerStyle: {marginHorizontal: 16},
          headerRightContainerStyle: {marginHorizontal: 16},
          headerStyle: {elevation: 0, shadowOffset: {width: 0, height: 0}, shadowRadius: 0, backgroundColor: 'rgb(244, 244, 236)', borderBottomWidth: 1},
        })}
      />
      <RootStack.Screen
        name={NavigationPages.NotePage}
        component={NotePage}
        options={({route, navigation}) => ({
          headerShown: false
        })}
      />
      <RootStack.Screen
        name={NavigationPages.ImagesFullScreenEdit}
        component={ImagesFullScreenEdit}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationPages.ImagesFullScreen}
        component={ImagesFullScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationPages.PhotosByMonth}
        component={PhotosByMonthContainer}
        options={({route, navigation}) => ({
          title: t('photosByMonth'),
          headerLeft: () => <HeaderBackButton labelVisible={false} tintColor={'#fff'} onPress={() => navigation.goBack()}/>,
          headerTitleStyle: styles.headerTitle,
          headerRightContainerStyle: {marginRight: 16},
          headerStyle: {backgroundColor: 'rgb(254, 183, 77)'},
          headerLeftContainerStyle: {marginLeft: 10}
        })}
      />
      <RootStack.Screen
        name={NavigationPages.ImageFullScreen}
        component={ImageFullScreen}
        options={{headerShown: false, headerBackTitleVisible: false}}
      />
    </RootStack.Navigator>
  );
};

export const styles = StyleSheet.create({
  headerTitle: {
    color: '#fff',
    fontFamily: Fonts.regular,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.26,
    alignSelf: 'center',
  },
  pageHeaderStyle: {
    elevation: 0,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 0,
    backgroundColor: 'rgb(254,183,77)'
  }
});
