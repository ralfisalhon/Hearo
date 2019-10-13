import React, { Component, PropTypes } from "react";
import {
  Container,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Grid,
  Col,
  Row,
  Footer,
  FooterTab,
  Item,
  Input
} from "native-base";
import {
  ListView,
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Alert,
  RefreshControl
} from "react-native";
import { Icon, List, ListItem } from "react-native-elements";
import Header from "../../components/Header";
import stylesGen from "../../styles/Styles";

export default class Transcripts extends Component {
  static navigationOptions = {
    title: "Transcripts",
    tabBarIcon: ({ tintColor }) => <Icon name="library-books" style={{ color: tintColor }} />
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  componentWillMount() {
    this.fetchData();
    // this.getUserID();
  }

  getUserID = async () => {
    const response = await fetch(
      "https://api.voximplant.com/platform_api/GetUsers/?account_id=ACCOUNT_ID&api_key=API_KEY&return_live_balance=false&count=10000"
    );
    const json = await response.json();
    console.log("USERID RESULTS:", json);

    for (i = 0; i < json.count; i++) {
      console.log("Inside loop of userid results");
      if (json.result[i].user_name == globalUsernameValue) {
        console.log("FOUND USERID", json.result[i].user_id);
        global.globalUser_ID = json.result[i].user_id;
      }
    }

    this.fetchData();
  };

  fetchData = async () => {
    // console.log("IM HERE");
    const response = await fetch(
      "https://api.voximplant.com/platform_api/GetCallHistory/?account_id=ACCOUNT_ID&api_key=API_KEY&with_records=true&desc_order=true&with_other_resources=false&with_calls=true&count=100&local_number=" +
        globalUsernameValue
    );
    const json = await response.json();

    // console.log("FETCHDATA RESULTS:", json);

    var newData = [];
    for (i = 0; i < json.count; i++) {
      if (json.result[i].duration <= 3) {
        // console.log("no transcription index", i);
      } else {
        if (
          json.result[i].records.length != 0 &&
          json.result[i].records[0].transcription_status == "Complete"
        ) {
          if (
            !(
              json.result[i].calls[0].custom_data == undefined &&
              json.result[i].calls[1].custom_data == undefined
            )
          ) {
            if (json.result[i].calls[0].custom_data == undefined) {
              json.result[i].calls[0].custom_data = json.result[i].calls[1].custom_data;
            }

            if (json.result[i].calls[0].remote_number == globalUsernameValue) {
              json.result[i].icon = "call-received";
              json.result[i].number = json.result[i].calls[0].local_number;
            } else {
              json.result[i].icon = "call-made";
              json.result[i].number = json.result[i].calls[0].remote_number;
            }

            const seconds = json.result[i].calls[0].duration;

            // from https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
            var date = new Date(null);
            date.setSeconds(seconds); // specify value for SECONDS here
            json.result[i].calls[0].duration = date.toISOString().substr(11, 8);

            newData.push(json.result[i]);
          }
        }
      }
    }

    this.setState({ data: newData });
    // console.log("DATA RESULTS", this.state.data);
  };

  doURLFetching(url, number, topic) {
    url = "https://" + url.substring(7);
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = e => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        global.globalTranscript = request.responseText;

        /* Removed the timestamps from the conversation */
        var counter = 0;
        while (globalTranscript[counter] != null) {
          if (globalTranscript[counter] == ":") {
            globalTranscript =
              globalTranscript.substring(0, counter - 3) +
              ":\n" +
              globalTranscript.substring(counter + 20);
          }

          /* Leave new line between people */
          var match = /\r|\n/.exec(globalTranscript[counter]);
          if (match) {
            globalTranscript =
              globalTranscript.substring(0, counter) + "\n" + globalTranscript.substring(counter);
            counter++;
          }

          counter++;
        }

        /* Remove the final new line */
        globalTranscript = globalTranscript.substring(0, counter - 2);

        global.globalSpeakingTo = number;
        globalTopic = topic;
        this.props.navigation.navigate("TheTranscript");
      } else {
        Alert.alert("Could not get transcriptions");
      }
    };

    request.send();
  }

  render() {
    return (
      <View style={stylesGen.container}>
        <Header />

        {this.state.data && this.state.data.length > 0 ? (
          /* Load under this part after data is fetched */
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ height: 25, marginTop: 5, borderBottomWidth: 0, borderColor: "gray" }}>
              <Text style={{ flex: 1, textAlign: "center", color: "white" }}>
                Pull down to refresh
              </Text>
            </View>
            <FlatList
              data={this.state.data}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
              }
              renderItem={({ item }) => (
                <ListItem
                  containerStyle={styles.listitem}
                  titleStyle={{ fontSize: 18 }}
                  subtitleStyle={{ fontSize: 14 }}
                  title={`+${item.number}`}
                  subtitle={`Topic: ${item.calls[0].custom_data}\nDuration: ${item.calls[0].duration}`}
                  subtitleNumberOfLines={2}
                  leftIcon={{ name: item.icon }}
                  onPress={() =>
                    this.doURLFetching(
                      item.records[0].transcription_url,
                      item.number,
                      item.calls[0].custom_data
                    )
                  }
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          /* Load under this part before data is fetched */
          <View>
            <View style={{ height: 25, marginTop: 5, borderBottomWidth: 0, borderColor: "gray" }}>
              <Text style={{ flex: 1, textAlign: "center", color: "white" }}>
                Pull down to refresh
              </Text>
            </View>
            <FlatList
              data={this.state.data}
              style={{ marginBottom: 95, height: 600 }}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
              }
              renderItem={({ item }) => (
                <View style={styles.loadingView}>
                  <Text style={styles.loading}>Your transcripts will appear here.</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

            <View style={styles.loadingView}>
              <Text style={styles.loading}>Your transcripts will appear here.</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listitem: {
    borderColor: "gray",
    borderBottomWidth: 2,
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
