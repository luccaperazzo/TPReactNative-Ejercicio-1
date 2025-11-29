import { Platform } from 'react-native';

const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      async getItem(key) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error getting item from localStorage:', error);
          return null;
        }
      },
      
      async setItem(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting item in localStorage:', error);
        }
      },
      
      async removeItem(key) {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing item from localStorage:', error);
        }
      }
    };
  } else {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
};

export const storage = createStorage();