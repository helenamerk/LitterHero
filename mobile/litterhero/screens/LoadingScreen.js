import React from 'react';
import {Text, Button, View, FlatList} from 'react-native';
import Lottie from 'lottie-react-native';

import Storage from '../lib/Storage';

class LoadingScreen extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;

    return {
      header: () => null,
      /* These values are used instead of the shared configuration! */
    };
  };

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  componentDidMount() {
    Storage.removeItem('phone'); // Uncomment for re-login per use case.
    this.animation.play();
    Storage.getItem('phone').then((value) => {
      if (value === null) {
        this.props.navigation.replace('LoginScreen');
      } else {
        this.props.navigation.replace('CameraScreen');
      }
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Lottie
          ref={(animation) => {
            this.animation = animation;
          }}
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#fff',
          }}
          source={require('../assets/loading.json')}
        />
      </View>
    );
  }
}
export default LoadingScreen;
