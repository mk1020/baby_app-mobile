import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    let jsonValue;
    if (typeof value === 'object') {
      jsonValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(`@${key}`, jsonValue || value);
  } catch (e) {
    console.warn(e);
  }
};

export const getStorageData = async key => {
  try {
    const value = await AsyncStorage.getItem(`@${key}`);
    return value;
  } catch (e) {
    console.warn(e);
  }
};
