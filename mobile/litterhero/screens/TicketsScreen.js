import * as React from 'react';

class TicketsScreen extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;

    return {
      title: params ? params.otherParam : 'Ticket Details',
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
    };
  };

  render() {
    return (
      <WebView
        source={{uri: 'https://adoptmeapp.org/appdemo/'}}
        style={{marginTop: 0}}
      />
    );
  }
}

export default TicketsScreen;
