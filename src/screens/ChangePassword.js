"use strict";

import React, { Component } from "react";
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
  Image
} from "react-native";

import LoginManager from "../manager/LoginManager";
import DefaultPreference from "react-native-default-preference";
import stylesGeneral from "../styles/Styles.js";
import COLOR from "../styles/Color";

let _this;

export default class ChangePass extends Component {
  constructor(props) {
    super(props);
    (this.passwordValue = ""),
      (this.passwordValue2 = ""),
      (this.getValue = this.getValue.bind(this));
  }

  getValue() {
    return this.state;
  }

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };
  backToAccountClicked() {
    this.props.navigation.navigate("AccountEdit");
  }

  changePassword = async () => {
    const response = await fetch(
      "https://api.voximplant.com/platform_api/SetUserInfo/?account_id=ACCOUNT_ID&api_key=API_KEY&user_id=" +
        globalUser_ID +
        "&user_password=" +
        this.passwordValue
    );
    const json = await response.json();
    if (json.result == 1) {
      Alert.alert("Password changed. Please login again with your new password.");
      DefaultPreference.set("usernameValue", undefined);
      LoginManager.getInstance().logout();
      this.props.navigation.navigate("Login");
    } else {
      Alert.alert("Something went wrong. Try again?");
    }
  };

  changePasswordClicked() {
    if (this.passwordValue.length < 6) {
      Alert.alert("YOU CANNOT PASS.", "Password has to be longer than 6 characters.", {
        cancelable: false
      });
    } else if (this.passwordValue != this.passwordValue2) {
      Alert.alert("Passwords are not equal.", "Passwords have to be same as each other.", {
        cancelable: false
      });
    } else {
      this.changePassword();
    }
  }

  updatePasswordText(text) {
    this.passwordValue = text;
  }
  updatePasswordText2(text) {
    this.passwordValue2 = text;
  }

  render() {
    return (
      <SafeAreaView style={stylesGeneral.container}>
        <KeyboardAvoidingView behavior="padding" style={stylesGeneral.container}>
          <TouchableWithoutFeedback style={stylesGeneral.container} onPress={Keyboard.dismiss}>
            <View style={stylesGeneral.container}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={globalHearoLogo} resizeMode="contain"></Image>
              </View>

              <View style={styles.infoContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  defaultValue={this.passwordValue}
                  secureTextEntry={true}
                  ref="Password"
                  autoCorrect={false}
                  placeholderTextColor="#b9e0ee"
                  onSubmitEditing={event => this.focusNextField("Password2")}
                  onChangeText={e => this.updatePasswordText(e)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  defaultValue={this.passwordValue}
                  secureTextEntry={true}
                  ref="Password2"
                  autoCorrect={false}
                  placeholderTextColor="#b9e0ee"
                  onChangeText={e => this.updatePasswordText2(e)}
                />

                <TouchableOpacity
                  style={stylesGeneral.button}
                  onPress={() => this.changePasswordClicked()}
                >
                  <Text style={stylesGeneral.buttonText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylesGeneral.button}
                  onPress={() => this.backToAccountClicked()}
                >
                  <Text style={stylesGeneral.buttonText}>Back to Account Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
    flexDirection: "column"
  },
  header: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 22,
    margin: 20,
    color: "white"
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
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
    marginBottom: 40
  },
  input: {
    height: 30,
    backgroundColor: "transparent",
    color: "#fff",
    marginBottom: 10,
    marginHorizontal: 40,
    borderBottomWidth: 2,
    borderColor: COLOR.PRIMARY,
    fontSize: 14
  },
  orText: {
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
    color: "#fff"
  },
  logoText: {
    color: "white",
    fontSize: 30
  }
});
