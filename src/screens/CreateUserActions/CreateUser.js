'use strict';

import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Image,
} from 'react-native';

import loginManager from '../../manager/LoginManager';
import DefaultPreference from 'react-native-default-preference';
import stylesGeneral from '../../styles/Styles.js';
import COLOR from '../../styles/Color';

let _this;

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        // loginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
        this.passwordValue = '',
        this.passwordValue2 = '',
        this.state = {
            usernameValue: '',
            email: '',
        }
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        return this.state;
    }
    componentWillMount() {
        _this = this;
        this.fillFields();
    }

    backToLoginClicked(){
      this.props.navigation.navigate('Login');
    }

    fillFields() {
        DefaultPreference.get('usernameValue').then(function(value) {
            _this.setState({usernameValue: globalCountry + globalPhoneNumber});
        });
    }

    /*
        Alert boxes to be shown after loginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
        Case numbers are error codes from https://voximplant.com/docs/references/websdk/voximplant/callevents#failed
    */
    onLoginFailed(errorCode) {
        switch(errorCode) {
            case 401:
            Alert.alert('Invalid password');
            break;
            case 403:
            Alert.alert('Account frozen');
            break;
            case 404:
            Alert.alert('Invalid username');
            break;
            case 701:
            Alert.alert('Token expired');
            break;
            default:
            case 500:
            Alert.alert('Internal error');
        }
    }

    validate = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text) === false)
        {
            Alert.alert(
                'Email address not correct.',
                'Please enter a proper email address.',
                { cancelable: false }
            )
            return false;
        }
        else {
            this.setState({email: text})
            console.log("Email is Correct");
            return true;
        }
    }

    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    };

    createAccountClicked() {
        console.log("HERE ARE THE PARAMETERS", this.state.usernameValue, this.state.email, this.passwordValue);
        if (this.passwordValue == this.passwordValue2){
          if(this.validate(this.state.email)) {
            loginManager.getInstance().createUser(this.state.usernameValue, this.state.email, this.passwordValue);
          }
            // this.props.navigation.navigate('App');
        }
        else {
            Alert.alert(
                'Passwords are not equal.',
                'Passwords have to be same as each other.',
                { cancelable: false }
            )
        }
    }

    updateUserText(text) {
        this.setState({usernameValue: text});
    }

    updatePasswordText(text) {
        this.passwordValue = text;
    }
    updatePasswordText2(text) {
        this.passwordValue2 = text;
    }
    updateEmailText(text) {
        this.state.email = text;
        globalEmail = text;
    }

    render() {
      return (
          <SafeAreaView style={stylesGeneral.container}>
              <KeyboardAvoidingView behavior='padding' style={stylesGeneral.container}>
                  <TouchableWithoutFeedback style={stylesGeneral.container} onPress={Keyboard.dismiss}>
                      <View style={stylesGeneral.container}>
                          <View style={styles.logoContainer}>
                              <Image style={styles.logo} source={globalHearoLogo} resizeMode="contain"></Image>
                          </View>

                          <View style={styles.infoContainer}>
                          <TextInput style={styles.input}
                              placeholder="CountryCode+PhoneNumber"
                              value={ this.state.usernameValue }
                              editable={false}
                              selectTextOnFocus={false}
                              autoFocus={ true }
                              ref='acc'
                              autoCapitalize='none'
                              autoCorrect={ false }
                              placeholderTextColor="#b9e0ee"
                              onSubmitEditing={ (event) => this.focusNextField('Password') }
                              onChangeText={ (e) => this.updateUserText(e) }
                          />

                          <TextInput style={styles.input}
                              placeholder="Email"
                              value={this.state.email}
                              autoCapitalize='none'
                              autoCorrect={ false }
                              placeholderTextColor="#b9e0ee"
                              onChangeText={ (e) => this.updateEmailText(e) }
                          />

                          <TextInput style={styles.input}
                              placeholder="Password"
                              defaultValue={ this.passwordValue }
                              secureTextEntry={ true }
                              ref='Password'
                              placeholderTextColor="#b9e0ee"
                              onSubmitEditing={ (event) => this.focusNextField('Password2') }
                              onChangeText={ (e) => this.updatePasswordText(e) }
                          />
                          <TextInput style={styles.input}
                              placeholder="Confirm password"
                              defaultValue={ this.passwordValue }
                              secureTextEntry={ true }
                              ref='Password2'
                              placeholderTextColor="#b9e0ee"
                              onChangeText={ (e) => this.updatePasswordText2(e) }
                          />

                          <TouchableOpacity style={stylesGeneral.button} onPress={ () => this.createAccountClicked() }>
                              <Text style={stylesGeneral.buttonText}>Create Account</Text>
                          </TouchableOpacity>
                          </View>
                      </View>
                  </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
              <TouchableOpacity style={stylesGeneral.button} onPress={ () => this.backToLoginClicked() }>
                  <Text style={stylesGeneral.buttonText}>Back to Login</Text>
              </TouchableOpacity>
          </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.PRIMARY,
        flexDirection: 'column',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'lightblue',
        paddingVertical: 20,
    },
    logo: {
        height: 150,
    },
    title: {
        color: '#fff',
        fontSize: 36,
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.9
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 20,
    },
    infoContainer2: {
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    input: {
        height: 30,
        backgroundColor: 'transparent',
        color: '#fff',
        marginBottom: 10,
        marginHorizontal: 40,
        borderBottomWidth: 2,
        borderColor: COLOR.BORDER,
        fontSize: 14,
    },
    orText: {
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 10,
        color: '#fff'
    },
    logoText: {
        color: 'white',
        fontSize: 30,
    },
})
