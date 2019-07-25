import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation'; // 1.0.0-beta.27

import colors from './config/colors';

import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';

const MainStack = createStackNavigator(
  {
    CameraScreen: {
      screen: CameraScreen,
    },
    LoginScreen: {
      screen: LoginScreen,
    },
    LoadingScreen: {
      screen: LoadingScreen,
    },
  },
  {
    initialRouteName: 'LoadingScreen',
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
