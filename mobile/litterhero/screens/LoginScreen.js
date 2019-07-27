import * as React from 'react';
import {Text, View, KeyboardAvoidingView} from 'react-native';
import {BlueButton, InverseButton} from '../components/Button';
import LargeLogo from '../components/LargeLogo';
import FormTextInput from '../components/FormTextInput';
import styles from '../config/styles';
import Storage from '../lib/Storage';
import Lottie from 'lottie-react-native';
import {loginUser} from '../requests';

class LoginScreen extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    const {params} = navigation.state;

    return {
      title: '',
      /* These values are used instead of the shared configuration! */
      header: null,
    };
  };

  state = {
    phone: '',
    name: '',
  };

  handlePhoneChange = (phone) => {
    this.setState({phone: phone});
  };

  handleNameChange = (name) => {
    this.setState({name: name});
  };

  handleLoginPress = async () => {
    const res = await loginUser(this.state.name, this.state.phone);
    await Storage.setItem('user_id', res.id);
    this.props.navigation.replace('CameraScreen');
  };

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.form}>
          <Lottie
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              flex: 1,
              top: 25,
              left: -80,
              height: 100,
              width: 100,
              backgroundColor: 'transparent',
            }}
            source={require('../assets/loading.json')}
          />
          <View style={styles.formFields}>
            <FormTextInput
              value={this.state.name}
              onChangeText={this.handleNameChange}
              placeholder='Name'
            />
            <FormTextInput
              value={this.state.phone}
              onChangeText={this.handlePhoneChange}
              placeholder='Phone'
              keyboardType='phone-pad'
            />
            <BlueButton label='Start' onPress={this.handleLoginPress} />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
