import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { RootStackParamsList } from '../../navigation/types';
import { NavigationPages } from '../../navigation/pages';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../common/theme/fonts';
import { useTranslation } from 'react-i18next';
import { signIn, signOut } from '../../storage/redux/appSlice';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, NavigationPages.notifications>;
}

const signInByStep = {
  1: null,
  2: null,
  3: null,
};
export const SignIn = ({}: Props) => {
  const { t, i18n } = useTranslation();
  const [currentStep, changeCurrentStep] = useState<1 | 2 | 3>(1);

  const dispatch = useDispatch();

  const CurrentStepComponent = signInByStep[currentStep];

  const PaginationRenderItems = useMemo(() => {
    return Object.keys(signInByStep).map((step, index) => (
      <PaginationElement
        step={step}
        active={step == currentStep.toString()}
        disabled={step !== currentStep.toString()}
        onPress={() => {}}
        key={`pagination element-${index}`}
      />
    ));
  }, [currentStep]);
  return (
    <SafeAreaView>
      <Text onPress={() => dispatch(signIn({ login: '123', password: '12334' }))}>Войти</Text>
      <View style={styles.stepsContainer}>{PaginationRenderItems}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepsContainer: {
    backgroundColor: '#03b556',
    width: 60,
    height: '100%',
  },
});

type TPaginationElementProps = {
  step: number | string;
  active?: boolean;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
};
const PaginationElement = (props: TPaginationElementProps) => {
  const { step, active, disabled, onPress } = props;
  return (
    <TouchableHighlight onPress={onPress} disabled={disabled}>
      <View style={[stepStyles.container, active && stepStyles.active]}>
        <Text style={stepStyles.text}>{step}</Text>
      </View>
    </TouchableHighlight>
  );
};
const stepStyles = StyleSheet.create({
  container: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  active: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
});
