import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';
import {Screens, TAuthPagesList, TUnAuthPagesList} from './types';

/**
 * Used in {@link Navigator} to keep track of navigation container mounts.
 */
export const isMountedRef: any = React.createRef();

/**
 * Used for navigation by NavigationService
 */
export const navigationRef: any = React.createRef();

const ERROR_NOT_INIT = 'Navigation Service: attempting to navigate with an unintialized ref.';

/**
 * Go to a screen using .navigate()
 */
const navigate = <T extends Record<string, unknown>>(name: Screens, params?: T): void => {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

/**
 * Go to a screen and remove all other screens in the current stack.
 */
const navigateAndReset = <T extends Record<string, unknown>>(name: Screens, params?: T): void => {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.dispatch(
      CommonActions.reset({
        routes: [{name, params}],
      }),
    );
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

/**
 * Pop the current screen.
 */
const goBack = (): void => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.goBack();
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

/**
 * Replace the current screen.
 */
const replace = <T extends Record<string, unknown>>(name: Screens, params?: T): void => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

/**
 * Custom navigation stack reset.
 * e.g.
 * assistant.reset([
 *        { name: "Screen1" },
 *        { name: "Screen2" },
 *        { name: "Screen3" },
 *        { name: "Screen4" },
 *      ], 3)
 */
const reset = <T extends Record<string, unknown>>(routes: { name: Screens; params?: T }[], index: number): void => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

/**
 * Pop the desired number of screens.
 */
const pop = (count: number): void => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.dispatch(StackActions.pop(count));
  } else {
    throw new Error(ERROR_NOT_INIT);
  }
};

export const navAssist = {
  navigate,
  navigateAndReset,
  goBack,
  replace,
  reset,
  pop,
};
