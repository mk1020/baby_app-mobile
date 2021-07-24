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
import {Settings} from '../components/settings/Settings';

const Tabs = createBottomTabNavigator<TabsList>();
const TabsNav = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name={NavigationTabs.Diary}
        component={Diary}
      />
      <Tabs.Screen name={NavigationTabs.Settings} component={Settings} />
    </Tabs.Navigator>
  );
};

const RootStack = createStackNavigator<RootStackList>();
export const AuthorizedScreens = (): JSX.Element => {
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
          headerLeftContainerStyle: {marginHorizontal: 16, marginTop: 16},
          headerRightContainerStyle: {marginHorizontal: 16, marginTop: 16},
          headerStyle: {elevation: 0, shadowOffset: {width: 0, height: 0}, shadowRadius: 0},
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

    </RootStack.Navigator>
  );
};

