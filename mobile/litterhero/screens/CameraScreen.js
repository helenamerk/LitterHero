import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
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
import {getTickets, submitTicket, getFormattedTimestamp} from '../requests';
import Lottie from 'lottie-react-native';
import {Button} from 'react-native-elements';

import SubmissionPending from '../components/SubmissionPending';

class CameraScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
      /* These values are used instead of the shared configuration! */
    };
  };

  // description deprecated: user has choice of button instead.
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    data: [],
    infoText: '',
    image: null,
    //description: '',
    //charCountStyle: styles.subtitleWhiteText,
    location: {},
    lastUpdated: null,
  };

  updateData = async () => {
    this.setState({infoText: 'Updating Tickets'});
    data = await getTickets();
    timestamp = getFormattedTimestamp();
    this.setState({data: data});
    this.setState({lastUpdated: timestamp});
    this.setState({infoText: ''});
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    this.updateData().then((res) => {
      console.log(res);
    });
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      charCountStyle:
        this.state.description.length < 100
          ? styles.subtitleWhiteText
          : styles.alertText,
    });
  }

  _keyboardDidHide() {
    this.setState({charCountStyle: styles.invisible});
  }

  // take a photo, then navigate to photo screen for review
  takeAndLocatePicture = async () => {
    if (this.camera) {
      const options = {quality: 1, base64: true};
      const imageData = await this.camera.takePictureAsync(options);
      const loc = await this.getCurrentLocation();

      this.setState({image: imageData.uri});
      //setTimeout(() => this._input.focus(), 1000);
    }
  };

  deletePicture = async () => {
    this.setState({description: ''});
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

  renderHeader = () => {
    return null;
  };

  renderFooter = () => {
    if (this.state.infoText == '') return null;

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
    data[i]['upvotes'] = data[i]['upvotes'] + 1;
    this.setState({data: data});
  };

  onTicketPress(i) {
    //console.log('i');
    //console.log(i);
    this.upvoteTicket(i);

    //console.log('ticket pressed');
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  getCurrentLocation = async () => {
    return navigator.geolocation.getCurrentPosition(
      (location) => {
        //console.log('location found!');
        //console.log(location);
        this.setState({location: location.coords});
        return location.coords;
      },
      (error) => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 0, maximumAge: 1000}
    );
  };

  handleSubmitTicket = (selectedServiceIndex) => {
    this.setState({infoText: 'Submitting...'});
    // submitting ticket!
    submitTicket(
      this.state.image,
      //this.state.description,
      this.state.location,
      selectedServiceIndex
    )
      .then((res) => {
        //console.log(JSON.stringify(res));
        //console.log(res.status);
        if (res.status == 200) {
          //console.log('post success');
          this.setState({infoText: 'Successful Post'});
          this.updateData().then((res) => {
            console.log(res);
          });
        } else {
          //console.log('non 200 status');
          this.setState({infoText: 'Error Submitting'});
        }
      })
      .catch((err) => {
        if (err.status == 406) {
          this.setState({
            infoText: 'Sorry! Currently only serving San Francisco',
          });
        }

        //console.log(err);
      });

    // clearing content
    //console.log('hello');
    this.setState({image: null});
  };

  render() {
    const {hasCameraPermission, image} = this.state;
    const limit = 100;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      let notify = !(this.state.infoText === '');

      return (
        <Swiper
          horizontal={true}
          loop={false}
          showsPagination={false}
          index={1}
        >
          <View style={this.viewStyle()}>
            <Text
              style={{
                fontSize: 30,
                color: colors.REAL_GREY,
                paddingBottom: 15,
              }}
            >
              Ticket Feed
            </Text>
            {this.state.data.length > 0 && (
              <FlatList
                style={{width: '100%'}}
                data={this.state.data}
                renderItem={({item, index}) => (
                  <ListTicket
                    ticket={item}
                    onPress={() => this.onTicketPress(index)}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={ListItemDivider}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
              />
            )}
            <Text
              style={{
                fontSize: 15,
                color: colors.REAL_GREY,
                paddingBottom: 15,
                paddingTop: 15,
              }}
            >
              Last Updated: {this.state.lastUpdated}
            </Text>
          </View>
          <View style={{flex: 1}}>
            {image && (
              // if image, show image :)
              // add a delete image button!
              // add a description field
              <View
                style={{
                  flex: 1,
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  marginTop: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    //console.log('image pressed');
                    //this._input.focus();
                  }}
                  style={{width: '100%', height: '100%'}}
                >
                  <Image
                    style={styles.largeImage}
                    resizeMode={'cover'}
                    source={{uri: image}}
                  />
                </TouchableOpacity>
                {/*<View
                  style={{
                    position: 'absolute',
                    top: 200,
                    left: 100,
                    backgroundColor: 'rgba(25,25,25,0.5)',
                    width: 100,
                    height: 50,
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                    alignItems: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <MultiToggleSwitch>
                    <MultiToggleSwitch.Item
                      onPress={() => {
                        this.state.description = 'Feces';
                        //console.log('Facebook tapped!');
                      }}
                      primaryColor={colors.LIGHT_BLUE}
                      secondaryColor={'#124E96'}
                      style={{backgroundColor: colors.BLACK}}
                    >
                      <Text style={{fontWeight: 'bold', color: colors.BLACK}}>
                        Feces
                      </Text>
                    </MultiToggleSwitch.Item>
                    <MultiToggleSwitch.Item
                      primaryColor={colors.LIGHT_BLUE}
                      onPress={() => {
                        this.state.description = 'Needle';
                      }}
                    >
                      <Text style={{fontWeight: 'bold', color: colors.BLACK}}>
                        Needle
                      </Text>
                    </MultiToggleSwitch.Item>
                    <MultiToggleSwitch.Item
                      primaryColor={colors.LIGHT_BLUE}
                      onPress={() => {
                        this.state.description = 'Graffiti';
                      }}
                    >
                      <Text style={{fontWeight: 'bold', color: colors.BLACK}}>
                        Graffiti
                      </Text>
                    </MultiToggleSwitch.Item>
                    <MultiToggleSwitch.Item
                      primaryColor={colors.LIGHT_BLUE}
                      onPress={() => {
                        this.state.description = 'Pothole';
                      }}
                    >
                      <Text style={{fontWeight: 'bold', color: colors.BLACK}}>
                        Pothole
                      </Text>
                    </MultiToggleSwitch.Item>
                    </MultiToggleSwitch>*/}
                {/*<View
                  style={{
                    position: 'absolute',
                    marginTop: 200,
                    paddingBottom: 15,
                    flex: 1,
                    width: '100%',
                    height: 50,
                  }}
                ><TextInput
                    ref={(c) => (this._input = c)}
                    placeholder={'Describe what you see...'}
                    onChangeText={(description) => {
                      //console.log('HELP ME');
                      this.setState({
                        charCountStyle:
                          description.length < limit
                            ? styles.subtitleWhiteText
                            : styles.alertText,
                      });
                      this.setState({description: description});
                    }}
                    onSubmitEditing={(event) => {
                      this._input.clear();
                      this._input.focus();
                      () => this.handleSubmitTicket(0)();
                    }}
                    style={{
                      height: 60,
                      borderColor: colors.SILVER,
                      borderBottomWidth: 1,
                      marginBottom: 20,
                      backgroundColor: 'rgba(250,250,250,0.5)',
                      fontSize: 20,
                      paddingLeft: 15,
                    }}
                  />

                  <Text style={this.state.charCountStyle}>
                    Characters Left: {this.state.description.length}/{limit}
                    {'\n'}
                  </Text></View>
                </View>*/}
                <View
                  style={{
                    position: 'absolute',
                    flex: 1,
                    top: 150,
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                  }}
                >
                  {/**Note: submit ticket id hardcoded and mapped to service code */}
                  <Button
                    raised
                    title='Feces'
                    type='outline'
                    onPress={() => this.handleSubmitTicket(0)}
                  />
                  <Button
                    raised
                    title='Needle'
                    type='outline'
                    onPress={() => this.handleSubmitTicket(1)}
                  />
                  <Button
                    raised
                    title='Graffiti'
                    type='outline'
                    onPress={() => this.handleSubmitTicket(2)}
                  />
                  <Button
                    raised
                    title='Pothole'
                    type='outline'
                    onPress={() => this.handleSubmitTicket(3)}
                  />
                  <Button
                    raised
                    title='Trash'
                    type='outline'
                    onPress={() => this.handleSubmitTicket(4)}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row-reverse',
                  }}
                >
                  <TouchableOpacity
                    style={styles.cameraScreenStyle}
                    onPress={this.deletePicture}
                  >
                    <Ionicons
                      name='md-close-circle-outline'
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
                      Delete Image{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
                    <Ionicons name='md-camera' size={40} color='white' />
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
            {notify && <SubmissionPending label={this.state.infoText} />}
          </View>
          <View style={this.viewStyle()}>
            <Text
              style={{
                fontSize: 25,
                color: colors.REAL_GREY,
                padding: 30,
                textAlign: 'left',
              }}
            >
              Coming soon:{'\n\n'}Map with cleanliness score. Find your next
              home based on reported data.
            </Text>
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
