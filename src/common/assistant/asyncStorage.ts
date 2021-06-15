import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    let jsonValue;
    if (typeof value === 'object') {
      jsonValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(`${key}`, jsonValue || value);
  } catch (e) {
    console.warn(e);
  }
};

export const getStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(`${key}`);
    return value;
  } catch (e) {
    console.warn(e);
  }
};
