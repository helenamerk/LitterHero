import * as React from 'react';
import {Text, View} from 'react-native';
import styles from '../config/styles';
import colors from '../config/colors';

export default class SubmissionPending extends React.Component {
  render() {
    const {label} = this.props;
    console.log(label);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(200,200,200,0.8)',
          position: 'absolute',
          width: '100%',
          height: 60,
          alignContent: 'space-around',
          top: 0,
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.pendingText}>{label}</Text>
      </View>
    );
  }
}
