import * as React from 'react';
import {ListItem, Badge} from 'react-native-elements';
import {View, Text, Image} from 'react-native';
import styles from '../config/styles';
import colors from '../config/colors';

export default class ListTicket extends React.Component {
  render() {
    const {ticket, onPress} = this.props;
    //let favorited = animal.isFavorite || false;
    return (
      <ListItem
        title={`${ticket.type}`}
        subtitle={
          <View
            style={{
              subtitleView: {
                flex: 1,
                flexDirection: 'column',
                paddingLeft: 0,
                paddingTop: 5,
              },
            }}
          >
            <Text style={styles.subtitleText}>Status: {ticket.status}</Text>
            <Text style={styles.subtitleText}>Location: {ticket.location}</Text>
          </View>
        }
        badge={{
          value: `UPVOTES: ${ticket.upvotes}`,
          textStyle: {color: 'white', fontSize: 12},
        }}
        rightElement={
          <Image
            style={{width: 100, height: '100%'}}
            source={{
              uri: ticket.url,
            }}
          />
        }
        onPress={() => onPress(ticket)}
      />
    );
  }
}
