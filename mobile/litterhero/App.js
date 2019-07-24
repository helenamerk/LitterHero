import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation'; // 1.0.0-beta.27

import colors from './config/colors';

import CameraScreen from './screens/CameraScreen';
//import SettingsScreen from './screens/SettingsScreen';
//import DetailsScreen from './screens/DetailsScreen';

const MainStack = createStackNavigator(
  {
    CameraScreen: {
      screen: CameraScreen,
    },
    // Settings: {
    //   screen: SettingsScreen,
    // },
    // DetailsScreen: {
    //   screen: DetailsScreen,
    // },
  },
  {
    initialRouteName: 'CameraScreen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.BLACK,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
