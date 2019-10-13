/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

"use strict";

import React from "react";
import {
  Text,
  View,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";
import { Icon, List, ListItem } from "react-native-elements";
import LoginManager from "../manager/LoginManager";
import CallManager from "../manager/CallManager";
import { Voximplant } from "react-native-voximplant";
import Header from "../components/Header";
import styles from "../styles/Styles.js";
import COLOR from "../styles/Color";
import CallButton from "../components/CallButton";

var Contacts = require("react-native-contacts");

global.globalTopic = " ";

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Call",
    tabBarIcon: ({ tintColor }) => <Icon name="phone" style={{ color: tintColor }} />
  };
  constructor(props) {
    super(props);
    this.number = "";
    this.state = {
      contactsList: [],
      num: ""
    };
  }

  componentDidMount() {
    LoginManager.getInstance().on("onConnectionClosed", this._connectionClosed);
  }

  componentWillUnmount() {
    LoginManager.getInstance().off("onConnectionClosed", this._connectionClosed);
  }

  componentWillMount() {
    /*
            From react-native-contacts
            getAllWithoutPhotos() function gets all contacts without profile pictures.
            Documentation: https://github.com/rt2zz/react-native-contacts
        */

    Contacts.getAllWithoutPhotos((err, contacts) => {
      if (err) throw err;
      this.fetchData(contacts);
    });

    this.getUserID();
  }

  getUserID = async () => {
    const response = await fetch(
      "https://api.voximplant.com/platform_api/GetUsers/?account_id=ACCOUNT_ID&api_key=API_KEY&return_live_balance=false&count=10000"
    );
    const json = await response.json();

    for (var i = 0; i < json.count; i++) {
      if (json.result[i].user_name == globalUsernameValue) {
        globalUser_ID = json.result[i].user_id;
      }
    }
  };

  fetchData = async contacts => {
    const response = await fetch(
      "https://api.voximplant.com/platform_api/GetUsers/?account_id=ACCOUNT_ID&api_key=API_KEY&return_live_balance=false&count=10000"
    );
    const json = await response.json();
    var newData = [];

    for (var i = 0; i < contacts.length; i++) {
      for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
        contacts[i].phoneNumbers[j].number = contacts[i].phoneNumbers[j].number.replace(/\D/g, "");

        for (var k = 0; k < json.count; k++) {
          if (json.result[k].user_name == contacts[i].phoneNumbers[j].number) {
            var pushArray = [];
            pushArray.push(contacts[i]);
            pushArray.push(j);
            newData.push(pushArray);
            // console.error(newData[0]);
            break;
          }
        }
      }
    }

    this.setState({ contactsList: newData });
  };

  sendToCall(number) {
    this.setState({ num: number });
    this.number = number;
  }

  _goToSettings = () => {
    this.props.navigation.navigate("Settings");
  };

  _goToLogin = () => {
    LoginManager.getInstance().logout();
    this.props.navigation.navigate("Login");
  };

  _connectionClosed = () => {
    this.props.navigation.navigate("Login");
  };

  updateTopic(text) {
    globalTopic = text;
  }

  async makeCall(isVideoCall) {
    if (globalTopic.length < 3) {
      Alert.alert("The Topic Field Cannot Be Empty");
      return;
    }
    console.log("MainScreen: make call: " + this.number + ", isVideo:" + isVideoCall);
    try {
      if (Platform.OS === "android") {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted = granted["android.permission.RECORD_AUDIO"] === "granted";
        const cameraGranted = granted["android.permission.CAMERA"] === "granted";
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn("MainScreen: makeCall: camera permission is not granted");
            return;
          }
        } else {
          console.warn("MainScreen: makeCall: record audio permission is not granted");
          return;
        }
      }
      const callSettings = {
        video: {
          sendVideo: isVideoCall,
          receiveVideo: isVideoCall
        },
        customData: globalTopic
      };

      let call = await Voximplant.getInstance().call(this.number, callSettings);
      CallManager.getInstance().addCall(call);
      this.props.navigation.navigate("Call", {
        callId: call.callId,
        isVideo: isVideoCall,
        isIncoming: false
      });
    } catch (e) {
      console.warn("MainScreen: makeCall failed" + e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <TextInput
          underlineColorAndroid="transparent"
          style={[stylesIndividual.input]}
          onChangeText={text => {
            this.number = text;
          }}
          placeholder="Call to"
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
          value={this.state.num}
          defaultValue={this.number}
          ref={component => (this._thisNumber = component)}
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false}
        />

        <TextInput
          style={stylesIndividual.input}
          placeholder="Topic"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false}
          onChangeText={e => this.updateTopic(e)}
        />
        <View style={stylesIndividual.callButton}>
          <CallButton icon_name="call" color={"white"} buttonPressed={() => this.makeCall(false)} />
        </View>

        {this.state.contactsList && this.state.contactsList.length > 0 ? (
          /* Load under this part after data is fetched */
          <View style={{ flex: 1, flexDirection: "column" }}>
            <FlatList
              data={this.state.contactsList}
              renderItem={({ item }) => (
                <ListItem
                  title={`${item[0].givenName} ${item[0].familyName}`}
                  subtitle={`${item[0].phoneNumbers[item[1]].number}`}
                  containerStyle={stylesIndividual.listitem}
                  onPress={() => this.sendToCall(item[0].phoneNumbers[item[1]].number)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          /* Load under this part before data is fetched */
          <View style={stylesIndividual.loadingView}>
            <Text style={stylesIndividual.loading}>
              Your contacts that use Hearo will appear here.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const stylesIndividual = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: "#fff",
    borderColor: COLOR.PRIMARY,
    borderWidth: 2,
    color: "black",
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 5
  },
  callButton: {
    justifyContent: "center",
    alignItems: "center"
  },
  listitem: {
    height: 50,
    backgroundColor: "white"
  },
  loading: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 14
  },
  loadingView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});
