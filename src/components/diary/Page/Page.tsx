import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../navigation/types';
import {NavigationPages} from '../../../navigation/pages';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {getRecordsByYearsAndMonth, IResult, notesAdapter} from '../assist';
import {PagePeriodYear} from './PagePeriodYear';
import {Months, PagePeriodMonth} from './PagePeriodMonth';
import {INoteJS} from '../../../model/types';
import {getNotesByPageDB} from '../../../model/assist';

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
  const {route, database} = props;
  const pageId = route.params?.pageData?.id;

  const [periods, setPeriods] = useState<TPeriod[]>([]);
  const [adaptedNotes, setAdaptedNotes] = useState<IResult>({});

  useFocusEffect(useCallback(() => {
    console.log('renderr');
    if (database) {
      (async function() {
        const notesDB = await getNotesByPageDB(pageId, database);
        console.log('notesDB', notesDB);
        if (notesDB) {
          const notes = notesAdapter(notesDB);
          setAdaptedNotes(getRecordsByYearsAndMonth(notes));
        }
      })();
    }
  }, [database, pageId])
  );

  /*useEffect(() => {
    if (props.notes) {
      const notes = notesAdapter(props.notes);
      setAdaptedNotes(getRecordsByYearsAndMonth(notes));
    }
  }, [props.notes]);*/

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
    <View style={styles.containerWrapper}>
      <FlatList
        data={periods}
        renderItem={renderItem}
        style={styles.container}
        keyExtractor={item => `year ${item.year} month ${item.month}`}
        //contentContainerStyle={{marginTop: 8}}
      />
    </View>
  );
});

export const Page = withDatabase(Page_);

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  container: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    flex: 1
  },
});
