import * as React from 'react';
import {Text, View} from 'react-native';
import styles from '../config/styles';

export default class SubmissionPending extends React.Component {
  render() {
    const {label, onPress} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgb(25,25,25,0.5)',
          position: 'absolute',
          width: '100%',
          height: 100,
          alignContent: 'center',
          top: 0,
        }}
        onPress={onPress}
      >
        <Text style={styles.subtitleText}>{label}</Text>
      </View>
    );
  }
}
