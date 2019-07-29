import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ActionSheetIOS,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Swiper from 'react-native-swiper';

import ListItemDivider from '../components/ListItemDivider';
import ListTicket from '../components/ListTicket';
import Storage from '../lib/Storage';

import styles from '../config/styles';
import colors from '../config/colors';
import {getTickets, submitTicket, getFormattedTimestamp} from '../requests';

import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';

import SubmissionPending from '../components/SubmissionPending';

class CameraScreen extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;
    const titleExists = !!navigation.getParam('title');
    if (!titleExists) {
      return {
        header: () => null,
        /* These values are used instead of the shared configuration! */
      };
    }

    return {
      title: navigation.getParam('title'),
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
      headerLeft: (
        <Button
          clear
          title={navigation.getParam('buttonInfoText')}
          type='clear'
          onPress={navigation.getParam('toggleButton')}
        />
      ),
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
    user_id: '',
    toggleAll: false, // defaults to showing only user's posts
    swiperIndex: 1,
  };

  updateData = async () => {
    let param = null;
    if (this.state.toggleAll == false) {
      param = this.state.user_id;
    }

    this.setState({infoText: 'Updating Tickets'});
    data = await getTickets(param);
    timestamp = getFormattedTimestamp();
    this.setState({data: data});
    this.setState({lastUpdated: timestamp});
    this.setState({infoText: ''});
  };

  async componentDidMount() {
    this.props.navigation.setParams({toggleButton: this.toggleButton});

    console.log(await Storage.getItem('user_id'));
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    const user_id = await Storage.getItem('user_id');
    this.setState({user_id: user_id});

    this.updateData(this.state.user_id);

    this.getCurrentLocation();
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

  _onOpenActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Pothole', 'Feces', 'Needles', 'Graffiti', 'Trash'],
        cancelButtonIndex: 0,
        title: 'Categorize Ticket',
        message:
          'What are you reporting? The city will prioritize dangerous items and health concerns.',
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          this.deletePicture();
        } else {
          this.handleSubmitTicket(buttonIndex - 1);
        }
      }
    );
  };

  // take a photo, then navigate to photo screen for review
  takeAndLocatePicture = async () => {
    if (this.camera) {
      const options = {quality: 1, base64: true};
      this._onOpenActionSheet();
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
      paddingTop: 0,
      alignContent: 'space-evenly',
      flexDirection: 'column',
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

  onTicketPress(i, image) {
    console.log('pressed.');
    // this.upvoteTicket(i);
    // this.props.navigation.navigate('ImageScreen', {
    //   image_uri: image,
    // });
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  getCurrentLocation = async () => {
    return navigator.geolocation.getCurrentPosition(
      (location) => {
        //console.log('location found!');
        console.log(location.coords);
        this.setState({location: location.coords});
        return location.coords;
      },
      (error) => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 0, maximumAge: 1000}
    );
  };

  handleSubmitTicket = (selectedServiceIndex) => {
    this.setState({infoText: 'Submitting to city...'});
    // submitting ticket!
    console.log('ack.');
    console.log(this.state.location.latitude);
    submitTicket(
      this.state.image,
      //this.state.description,
      this.state.location,
      selectedServiceIndex
    )
      .then((res) => {
        if (res.status == 200) {
          this.setState({infoText: 'Successful Post'});
          this.updateData();
        } else {
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
    this.setState({image: null});
  };

  onSwipe = (index) => {
    console.log('index changed', index);
    this.setState({swiperIndex: index});
    if (index == 0) {
      this.props.navigation.setParams({title: 'Ticket Feed'});
      this.setState({toggleAll: false});
      this.props.navigation.setParams({buttonInfoText: 'Show All'});
    } else if (index == 1) {
      this.props.navigation.setParams({title: null});
      this.props.navigation.setParams({buttonInfoText: null});
    } else if (index == 2) {
      this.props.navigation.setParams({title: null});
      this.props.navigation.setParams({buttonInfoText: null});
    } else if (index == 3) {
      this.props.navigation.setParams({title: null});
      this.props.navigation.setParams({buttonInfoText: null});
    }
  };

  toggleButton = () => {
    console.log('hello');
    this.setState({toggleAll: !this.state.toggleAll});
    this.updateData();
    if (this.state.toggleAll == false) {
      this.props.navigation.setParams({buttonInfoText: 'Show All'});
    } else {
      this.props.navigation.setParams({buttonInfoText: 'My Tickets'});
    }
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
          index={this.state.swiperIndex}
          onIndexChanged={this.onSwipe}
          onScrollBeginDrag={this.onScrollBegin}
        >
          <View style={this.viewStyle()}>
            {/*<View style={{flexDirection: 'row', marginBottom: 15}}>
              <Button
                raised
                title={this.state.toggleAll ? 'All Tickets' : 'Your Tickets'} // toggleAll false => get only use tickets, show button for all ticekts
                type='outline'
                onPress={() => {
                  this.setState({toggleAll: !this.state.toggleAll});
                  this.updateData();
                }}
                style={{padding: 0, margin: 0}}
                containerStyle={{marginRight: 10}}
              />
            </View>*/}
            {this.state.data.length > 0 && (
              <FlatList
                style={{width: '100%'}}
                data={this.state.data}
                renderItem={({item, index}) => (
                  <ListTicket
                    ticket={item}
                    onPress={() => this.onTicketPress(index, item.image_url)}
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
                <Image
                  style={styles.largeImage}
                  resizeMode={'cover'}
                  source={{uri: image}}
                />
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
                    />
                  </TouchableOpacity>
                </View>
              </Camera>
            )}
            {notify && <SubmissionPending label={this.state.infoText} />}
          </View>
          <View style={this.viewStyle()}>
            <Text
              style={{
                fontSize: 20,
                color: colors.BLACK,
                padding: 30,
                textAlign: 'left',
              }}
            >
              What is LitterHero?{'\n\n'}LitterHero helps concerned citizens
              report sanitation issues to the city. It directly integrates with
              ticket management systems to hold the city accountable.
              {'\n\n'}What is the state of this project?{'\n\n'}Currently we
              report to their development environment - this means the reports
              are not yet live. This was built in 3 days while competing in
              StartupBus as a proof of concept. {'\n\n'}How can I help?{'\n\n'}
              To make this a reality and hold our cities accountable, DM
              @BeALitterHero on Twitter, or email helena@merkonline.com.
            </Text>
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
                textAlign: 'left',
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
