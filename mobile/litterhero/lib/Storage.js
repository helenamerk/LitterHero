import {AsyncStorage} from 'react-native';

const Storage = {
  getItem: function(key) {
    return AsyncStorage.getItem(key)
      .then((item) => {
        return JSON.parse(item);
      })
      .catch((err) => {
        console.error('getting key failed');
        console.error(key);
        console.error(err);
        return null;
      });
  },
  setItem: function(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: function(key) {
    return AsyncStorage.removeItem(key);
  },
};

export default Storage;
