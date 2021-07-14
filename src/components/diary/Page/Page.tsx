import React, {memo, useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet} from 'react-native';
import {NotesTableName} from '../../../model/schema';
import {RouteProp} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../navigation/types';
import {NavigationPages} from '../../../navigation/pages';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import {getRecordsByYearsAndMonth, IResult} from '../assist';
import {PagePeriodYear} from './PagePeriodYear';
import {Months, PagePeriodMonth} from './PagePeriodMonth';
import {INoteJS} from '../../../model/types';

type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.DiaryPage>
  database: any
  notes: INoteJS[]
}

type TPeriod = {
  year: number
  month?: number
}
export const Page_ = memo((props: TProps) => {
  const {route, notes} = props;

  const [periods, setPeriods] = useState<TPeriod[]>([]);
  const [adaptedNotes, setAdaptedNotes] = useState<IResult>({});

  useEffect(() => {
    setAdaptedNotes(getRecordsByYearsAndMonth(mock));
  }, [notes]);

  useEffect(() => {
    const preparingPeriods: TPeriod[] = [];
    Object.entries(adaptedNotes).forEach(([year, months]) => {
      const nowYear = new Date().getFullYear();
      if (Number(year) === nowYear) {
        const monthsInCurrYear = Object.keys(months);
        monthsInCurrYear.forEach(month => {
          preparingPeriods.push({year: Number(year), month: Number(month)});
        });
      } else {
        preparingPeriods.push({year: Number(year)});
      }
    });
    setPeriods(preparingPeriods.reverse());
  }, [adaptedNotes]);

  const renderItem = ({item, index}: any) => {
    const nowYear = new Date().getFullYear();

    return (
      nowYear === item.year ? (
        <PagePeriodMonth
          year={item.year}
          month={item.month as Months}
          notesInMonth={adaptedNotes[item.year]?.[item.month]}
          open={index === 0}
        />
      ) : (
        <PagePeriodYear
          year={item.year}
          notesByMonths={adaptedNotes[item.year]}
        />
      )
    );
  };

  return (
    <FlatList
      data={periods}
      renderItem={renderItem}
      style={styles.container}
      keyExtractor={item => `year ${item.year} month ${item.month}`}
    />
  );
});

const mock = [
  {
    id: '21312312',
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #1',
    note: 'Текст записи тестирую',
    createdAt: 1594665483916,
  },
  {
    id: '21311231312',
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #2',
    note: 'Текст записи тестирую тестирую тестирую тестирую тестирую тестирую тестирую тестирую',
    createdAt: 1586803083916,
  },
  {
    id: '213123123242',
    pageId: '123',
    pageType: 3,
    photo: 'photo',
    title: 'Title Note #3',
    note: 'Текст записи тестирую',
    createdAt: 1592073483916,
  },
  {
    id: '213123121232',
    pageId: '123',
    pageType: 9,
    photo: 'photo',
    title: 'Title Note #1',
    note: 'Текст записи тестирую',
    createdAt: 1592073483916,
  },
  {
    id: '21222311231312',
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #2',
    note: 'Текст записи тестирую тестирую тестирую тестирую тестирую тестирую тестирую тестирую',
    createdAt: 1626266770852,
  },
  {
    id: '213123423123242',
    pageId: '123',
    pageType: 3,
    photo: 'photo',
    title: 'Title Note #3',
    note: 'Текст записи тестирую',
    createdAt: 1618404404243,
  },
  {
    id: '213122131212232',
    pageId: '123',
    pageType: 9,
    photo: 'photo',
    title: 'Title Note #1',
    note: 'Текст записи тестирую',
    createdAt: 1613310423517,
  },
];

export const Page = withDatabase(withObservables(['route'], ({database, route}: TProps) => {
  return {
    notess: database?.collections?.get(NotesTableName).query(
      Q.where('page_id', route?.params?.pageData?.id),
    ).observe(),
  };
})(Page_));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  }
});
