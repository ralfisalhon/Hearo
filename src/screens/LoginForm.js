"use strict";

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  StatusBar
} from "react-native";
import loginManager from "../manager/LoginManager";
import DefaultPreference from "react-native-default-preference";
import styles from "../styles/Styles";
import COLOR from "../styles/Color";
import Header from "../components/Header";

let _this;

export default class LoginScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false
  };

  constructor() {
    super();
    loginManager.getInstance().on("onLoginFailed", errorCode => this.onLoginFailed(errorCode));
    loginManager.getInstance().on("onLoggedIn", param => this.onLoggedIn());
    (this.password = ""),
      (this.state = {
        usernameValue: ""
      });
  }

  /*
        Loads Logo on componentWillMount() into a global variable for quicker loading and easy access across classes.
        calls fillFields() for use of DefaultPreference later.
    */
  componentWillMount() {
    // DefaultPreference.get('usernameValue').then(function(value) {
    //     console.warn(value);
    // });
    // global.globalHearoLogo = require('../assets/images/256x256.png');
    // global.globalHearoLogo = require('../assets/images/HearoLogo.png');
    _this = this;

    DefaultPreference.get("usernameValue").then(function(value) {
      if (value != undefined) {
        loginManager.getInstance().loginWithToken();
        return;
      }
    });

    this.fillFields();
  }

  fillFields = () => {
    DefaultPreference.get("usernameValue").then(function(value) {
      _this.setState({ usernameValue: value });
      globalUsernameValue = value;
    });
  };

  /*
        Alert boxes to be shown after loginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
        Case numbers are error codes from https://voximplant.com/docs/references/websdk/voximplant/callevents#failed
    */
  onLoginFailed(errorCode) {
    switch (errorCode) {
      case 401:
        Alert.alert("Invalid password");
        break;
      case 403:
        Alert.alert("Account frozen");
        break;
      case 404:
        Alert.alert("Invalid username");
        break;
      case 701:
        Alert.alert("Token expired");
        break;
      default:
      case 500:
        Alert.alert("Internal error. Try again?");
    }
  }

  onLoggedIn = () => {
    DefaultPreference.get("usernameValue").then(function(value) {
      if (value == globalUsernameValue) {
        return;
      }
    });

    if (globalUsernameValue.length > 1) {
      DefaultPreference.set("usernameValue", globalUsernameValue);
    }
    this.props.navigation.navigate("App");
  };

  onForgotPassClicked() {
    this.props.navigation.navigate("ForgotPass");
  }

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  loginClicked() {
    if (!(this.usernameValue < 5)) {
      if (this.passwordValue.length >= 6) {
        globalUsernameValue = this.state.usernameValue;
        loginManager
          .getInstance()
          .loginWithPassword(
            this.state.usernameValue + "@APPLICATION_NAME.USERNAME.voximplant.com",
            this.passwordValue
          );
      } else {
        Alert.alert("Password has to be at least 6 characters.");
      }
    }
  }

  createAccountClicked() {
    this.props.navigation.navigate("SendCode");
  }

  updateUserText(text) {
    this.setState({ usernameValue: text });
  }

  updatePasswordText(text) {
    this.passwordValue = text;
  }

  render() {
    return (
      /*
                SafeAreaView and KeyboardAvoidingView used for TextInput scrolling up with activation of a keyboard.
            */
      <SafeAreaView style={stylesIndividual.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior="padding" style={stylesIndividual.container}>
          <TouchableWithoutFeedback style={stylesIndividual.container} onPress={Keyboard.dismiss}>
            <View style={stylesIndividual.container}>
              <View style={stylesIndividual.logoContainer}>
                {/*
                                    globalHearoLogo defined in componentWillMount()
                                */}
                <Image
                  style={stylesIndividual.logo}
                  source={globalHearoLogo}
                  resizeMode="contain"
                ></Image>
              </View>
              <View style={stylesIndividual.infoContainer}>
                {/*
                                    username parameter for VoxImplant login
                                */}
                <TextInput
                  style={stylesIndividual.input}
                  keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                  placeholder="country code + phone number"
                  value={this.state.usernameValue}
                  ref="acc"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={event => this.focusNextField("password")}
                  onChangeText={e => this.updateUserText(e)}
                  blurOnSubmit={true}
                  placeholderTextColor="#b9e0ee"
                  maxLength={15}
                />

                {/*
                                    password parameter for VoxImplant login
                                */}
                <TextInput
                  style={stylesIndividual.input}
                  placeholder="password"
                  defaultValue={this.passwordValue}
                  secureTextEntry={true}
                  ref="password"
                  onChangeText={e => this.updatePasswordText(e)}
                  blurOnSubmit={true}
                  placeholderTextColor="#b9e0ee"
                />

                {/*
                                    Calls VoxImplant login with above parameters
                                */}
                <TouchableOpacity
                  style={[styles.button, { marginBottom: 15 }]}
                  onPress={() => this.loginClicked()}
                >
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={{ width: 200, justifyContent: "center", alignSelf: "center" }}
          onPress={() => this.onForgotPassClicked()}
        >
          <Text style={stylesIndividual.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View>
          <Text style={stylesIndividual.orText}>Or,</Text>
        </View>
        <View style={stylesIndividual.infoContainer2}>
          {/*
                        Navigates to Phone Verification for initial step of account creation
                    */}
          <TouchableOpacity style={styles.button} onPress={() => this.createAccountClicked()}>
            <Text style={styles.buttonText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const stylesIndividual = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLOR.PRIMARY
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40
  },
  logo: {
    height: 150
  },
  title: {
    color: "#fff",
    fontSize: 36,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9
  },
  infoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20
  },
  infoContainer2: {
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    marginBottom: 20
  },
  buttonContainer: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 15
  },
  orText: {
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 15,
    color: "#fff"
  },
  forgotText: {
    fontSize: 12,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: -10,
    color: "#fff"
  },
  logoText: {
    color: "white",
    fontSize: 30
  },
  input: {
    height: 40,
    backgroundColor: "transparent",
    color: "#fff",
    marginBottom: 10,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: "#a2dbf0",
    fontSize: 16
  }
});
