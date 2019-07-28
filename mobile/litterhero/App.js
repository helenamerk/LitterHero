import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'; // 1.0.0-beta.27
import {connectActionSheet} from '@expo/react-native-action-sheet';

import colors from './config/colors';

import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import styles from './config/styles';
import {InverseButton} from './components/Button';

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
        backgroundColor: colors.SEE_THROUGH,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colors.BLACK,
      },
    },
  }
);

class ImageScreen extends React.Component {
  render() {
    let {navigation} = this.props;
    console.log(navigation.getParam('image_uri'));
    return (
      <View style={styles.formFields}>
        <InverseButton
          onPress={() => this.props.navigation.goBack()}
          label='Dismiss'
        />
        <Image
          style={{flex: 1, width: '100%', height: '100%'}}
          resizeMode={'cover'}
          source={{uri: navigation.getParam('image_uri')}}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    ImageScreen: {
      screen: ImageScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
