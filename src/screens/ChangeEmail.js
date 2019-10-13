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

export default class ChangeEmail extends Component {
  constructor(props) {
    super(props);
    (this.emailValue = ""), (this.getValue = this.getValue.bind(this));
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

  changeEmail = async () => {
    const response = await fetch(
      "https://api.voximplant.com/platform_api/SetUserInfo/?account_id=ACCOUNT_ID&api_key=API_KEY&user_id=" +
        globalUser_ID +
        "&user_display_name=" +
        this.emailValue
    );
    const json = await response.json();
    if (json.result == 1) {
      Alert.alert("Email changed. Please login again.");
      DefaultPreference.set("usernameValue", undefined);
      LoginManager.getInstance().logout();
      this.props.navigation.navigate("Login");
    } else {
      Alert.alert("Something went wrong. Try again?");
    }
  };

  changeEmailClicked = () => {
    if (this.validate(this.emailValue)) {
      this.changeEmail();
    }
  };

  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      Alert.alert("Email address not correct.", "Please enter a proper email address.", {
        cancelable: false
      });
      return false;
    } else {
      this.setState({ email: text });
      console.log("Email is Correct");
      return true;
    }
  };

  updateEmailText(text) {
    this.emailValue = text;
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
                  placeholder="Email"
                  secureTextEntry={false}
                  ref="Email"
                  autoCorrect={false}
                  autoCapitalize={"none"}
                  placeholderTextColor="#b9e0ee"
                  onChangeText={e => this.updateEmailText(e)}
                />

                <TouchableOpacity
                  style={stylesGeneral.button}
                  onPress={() => this.changeEmailClicked()}
                >
                  <Text style={stylesGeneral.buttonText}>Change Email</Text>
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
    // backgroundColor: 'lightblue',
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
    borderColor: COLOR.BORDER,
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
