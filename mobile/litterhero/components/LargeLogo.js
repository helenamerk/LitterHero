import * as React from 'react';
import {Image} from 'react-native';
import styles from '../config/styles';
import Lottie from 'lottie-react-native';

export default class LargeLogo extends React.Component {
  render() {
    return (
      <Lottie
        ref={(animation) => {
          this.animation = animation;
        }}
        style={{
          width: 500,
          height: 500,
          backgroundColor: '#fff',
        }}
        source={require('../assets/loading.json')}
      />
    );
  }
}
