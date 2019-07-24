import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Swiper from 'react-native-swiper';

import ListItemDivider from '../components/ListItemDivider';
import ListTicket from '../components/ListTicket';

import {Ionicons} from '@expo/vector-icons';
import styles from '../config/styles';
import colors from '../config/colors';
import Lottie from 'lottie-react-native';

class CameraScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
      /* These values are used instead of the shared configuration! */
    };
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    data: [],
    loading: false,
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});

    firstItem = {
      id: '123',
      type: 'poop',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      location: '5th & Market, SF',
    };

    this.setState({data: [firstItem]});
    //this.animation.play();
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        console.log('location found!');
        console.log(location);
        return location;
      },
      (error) => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 0, maximumAge: 1000}
    );
  };

  // take a photo, then navigate to photo screen for review
  takeAndLocatePicture = async () => {
    const {navigation} = this.props;

    if (this.camera) {
      console.log('TAKING PICTURE.');
      const options = {quality: 0.5, base64: true};
      const imageData = await this.camera.takePictureAsync(options);
      const locationData = await this.getCurrentLocation();

      console.log(imageData.uri);
      console.log(locationData);

      console.log('would navigate here!');
      // navigation.navigate('Photo', {
      //   photoURI: imageData.uri,
      // });
    }
  };

  viewStyle() {
    return {
      flex: 1,
      backgroundColor: colors.MISCHKA,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    };
  }

  enderHeader = () => {
    return null;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <ActivityIndicator animating size='large' />
      </View>
    );
  };

  onTicketPress() {
    console.log('ticket pressed');
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Swiper
          horizontal={true}
          loop={false}
          showsPagination={false}
          index={1}
        >
          <View style={this.viewStyle()}>
            <Text style={{fontSize: 30, color: colors.REAL_GREY}}>
              Ticket Feed
            </Text>
            <FlatList
              style={{width: '100%'}}
              data={this.state.data}
              renderItem={({item, index}) => (
                <ListTicket
                  ticket={item}
                  onPress={() => this.onTicketPress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={ListItemDivider}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            />
          </View>

          <View style={{flex: 1}}>
            <Camera
              style={{flex: 1}}
              type={this.state.type}
              ref={(ref) => {
                this.camera = ref;
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}
              >
                <TouchableOpacity
                  style={styles.cameraScreenStyle}
                  onPress={this.takeAndLocatePicture}
                >
                  <Ionicons
                    name='ios-arrow-dropup-circle'
                    size={40}
                    color='white'
                  />
                  <Text
                    style={{
                      fontSize: 25,
                      marginBottom: 30,
                      marginTop: 10,
                      color: 'white',
                    }}
                  >
                    {' '}
                    File Ticket{' '}
                  </Text>
                  {/* Add an animated button?
                  <Lottie
                    ref={(animation) => {
                      this.animation = animation;
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#fff',
                    }}
                    source={require('../assets/take_photo.json')}
                  /> */}
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
          <View style={this.viewStyle()}>
            <Text style={{fontSize: 48, color: 'white'}}>Bottom</Text>
          </View>
        </Swiper>
      );
    }
  }
}

export default CameraScreen;
