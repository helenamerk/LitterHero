import * as React from 'react';
import {ListItem, Badge} from 'react-native-elements';
import {View, Text, Image} from 'react-native';
import styles from '../config/styles';
import colors from '../config/colors';

export default class ListTicket extends React.Component {
  render() {
    const {ticket, onPress} = this.props;
    //let favorited = animal.isFavorite || false;
    console.log(ticket);
    const location = ticket.location || ticket.lat + ', ' + ticket.long;
    return (
      <ListItem
        title={`${ticket.description}`}
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
            <Text style={styles.subtitleText}>
              Status: {ticket.status || 'pending'}
            </Text>
            <Text style={styles.subtitleText}>Location: {location}</Text>
          </View>
        }
        // badge={{
        //   value: `UPVOTES: ${ticket.upvotes || 0}`,
        //   textStyle: {color: 'white', fontSize: 12},
        // }}
        rightElement={
          <Image
            style={{width: 100, height: '100%'}}
            source={{uri: ticket.image_url}}
          />
        }
        onPress={() => onPress(ticket)}
      />
    );
  }
}
