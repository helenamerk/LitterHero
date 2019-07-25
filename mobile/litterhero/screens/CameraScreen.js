import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Swiper from 'react-native-swiper';

import ListItemDivider from '../components/ListItemDivider';
import ListTicket from '../components/ListTicket';
import FormTextInput from '../components/FormTextInput';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {BlueButton} from '../components/Button';

import {Ionicons} from '@expo/vector-icons';
import styles from '../config/styles';
import colors from '../config/colors';
import {getTickets} from '../requests';
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
    image: null,
    description: '',
    charCountStyle: styles.subtitleText,
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});

    data = getTickets();

    this.setState({data: data});
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

      this.setState({image: imageData.uri});

      console.log(imageData.uri);
      console.log(this.state.image);
      console.log(locationData);

      console.log('would navigate here!');
      // navigation.navigate('Photo', {
      //   photoURI: imageData.uri,
      // });
    }
  };

  deletePicture = async () => {
    this.setState({image: null});
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

  upvoteTicket = (i) => {
    data = this.state.data;
    console.log(data);
    console.log(data[0]['upvotes']);
    console.log(i);
    data[i]['upvotes'] = data[i]['upvotes'] + 1;
    this.setState({data: data});
  };

  onTicketPress(i) {
    console.log('i');
    console.log(i);
    this.upvoteTicket(i);

    console.log('ticket pressed');
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  render() {
    const {hasCameraPermission, image} = this.state;
    const limit = 100;

    console.log('image');
    console.log(image);

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
                  onPress={() => this.onTicketPress(index)}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={ListItemDivider}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            />
          </View>

          <View style={{flex: 1}}>
            {image && (
              // if image, show image :)
              // add a delete image button!
              // add a description field
              <DismissKeyboardView
                style={{
                  flex: 1,
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  padding: 20,
                  marginTop: 50,
                }}
              >
                <FormTextInput
                  multiline={true}
                  numberOfLines={6}
                  maxLength={130}
                  placeholder='Describe what this looks like.'
                  value={this.state.description}
                  onChangeText={(description) => {
                    this.setState({
                      charCountStyle:
                        description.length < limit
                          ? styles.subtitleText
                          : styles.alertText,
                    });
                    this.setState({description});
                  }}
                  style={{height: 100}}
                />
                <Text style={this.state.charCountStyle}>
                  Characters Left: {this.state.description.length}/{limit}
                  {'\n'}
                </Text>
                <Image style={styles.largeImage} source={{uri: image}} />
                <BlueButton
                  onPress={() => {
                    console.log('hello');
                    this.setState({image: null});
                  }}
                  label='Submit'
                  color={colors.BLACK}
                />
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    style={styles.cameraScreenStyle}
                    onPress={this.deletePicture}
                  >
                    <Ionicons name='md-close-circle' size={40} color='black' />
                    <Text
                      style={{
                        fontSize: 25,
                        marginBottom: 30,
                        marginTop: 10,
                        color: 'black',
                      }}
                    >
                      {' '}
                      Delete Image{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </DismissKeyboardView>
            )}
            {!image && (
              // if no image, render camera!

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
            )}
          </View>
          <View style={this.viewStyle()}>
            <Text
              style={{
                fontSize: 30,
                color: colors.REAL_GREY,
                padding: 30,
                textAlign: 'center',
              }}
            >
              To report urgent incidents, reach out to 911 directly.
            </Text>
          </View>
        </Swiper>
      );
    }
  }
}

export default CameraScreen;
