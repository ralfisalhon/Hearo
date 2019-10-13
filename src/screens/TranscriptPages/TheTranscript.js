/*
* Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
*/

'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    TouchableOpacity,
    Alert,
    ScrollView,
    FlatList,
    ListItem,
    StatusBar,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
} from 'react-native';

import { Icon } from 'react-native-elements';

import Highlighter from 'react-native-highlight-words';

import email from 'react-native-email';
import Header from '../../components/Header';
import SearchBar from 'react-native-searchbar';

import COLOR from "../../styles/Color";

let _this;

export default class TheTranscript extends Component {
    static navigationOptions = {
        tabBarVisible: false,
    }

    constructor(props) {
        global.searchText = "";
        super(props);
        this.paddingInput = new Animated.Value(0);
        this.state = {
            data: [],
            refresh: false,
            showKeyboard: false,
            indexes: [],
            onIndex: 0,
        }
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

        this.editTranscript();
    };

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        this.setState({
            showKeyboard: true
        })

        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 60,
        }).start();
    };

    keyboardWillHide = (event) => {
        this.setState({
            showKeyboard: false
        })

        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 0,
        }).start();
    };

    // this.state.data.push(json.result[i]);

    editTranscript = async () => {
        var counter = 0;
        var oldcounter = counter;

        /* Find the first speaker */
        var firstSpeaker = "";
        while (globalTranscript[counter] != null && globalTranscript[counter] != ":") {
            firstSpeaker += globalTranscript[counter];
            counter++;
        }
        counter = 0;

        var speaker = 1;
        if (firstSpeaker == globalEmail) {
            speaker = 2;
        }

        /* Find newlines and add lines to array with correct styling */
        while (globalTranscript[counter] != null) {
            var match = /\r|\n/.exec(globalTranscript[counter]);
            if (match) {
                if (counter - oldcounter > 1) {
                    var newLine = globalTranscript.substring(oldcounter, oldcounter+1).toUpperCase() + globalTranscript.substring(oldcounter + 1, counter);
                    if (speaker == 1) {
                        var line = {style: styles.speaker1, line: newLine};
                        speaker = 2;
                    }
                    else {
                        var line = {style: styles.speaker2, line: newLine};
                        speaker = 1;
                    }

                    this.state.data.push(line);
                }

                counter++;
                oldcounter = counter;
            }

            /* Remove username */
            if (globalTranscript[counter] == ":") {
                oldcounter = counter;
            }

            counter++;
        }
    };

    goBack = () => {
        this.props.navigation.navigate("Transcripts");
    };

    // Documentation: https://www.npmjs.com/package/react-native-email
    handleEmail = () => {
        const to = [] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            cc: [], // string or array of email addresses
            bcc: globalEmail,
            subject: 'Our conversation about: ' + globalTopic,
            body: globalTranscript
        }).catch(console.error)
    };

    updateSearchText = (results) => {
        searchText = results;

        this.handleSearchResults();
    };


    clearSearchResults = () => {
        this.searchBar.hide();

        searchText = "";

        this.setState({
            refresh: !this.state.refresh
        })
    };

    handleSearchResults = () => {
        this.scrollHandler(searchText);

        this.setState({
            refresh: !this.state.refresh
        })
    }

    scrollHandler = (searchText) => {
        searchText = searchText.toLowerCase();
        var itemIndex = 0;
        this.state.indexes = [];

        for (var i = 0; i < this.state.data.length; i++) {
            var lowerCaseLine = this.state.data[i].line;
            lowerCaseLine = lowerCaseLine.toLowerCase();
            if (lowerCaseLine.includes(searchText)) {
                // itemIndex = i;
                this.state.indexes.push(i);
            }
        }

        if (this.state.indexes.length > 0) {
            this.state.onIndex = 0;
            this.flatListRef.scrollToIndex({animated: true, index: this.state.indexes[this.state.onIndex]});
        }
    }

    indexUp = () => {
        this.state.onIndex -= 1;
        if (this.state.onIndex < 0) {
            this.state.onIndex = this.state.indexes.length-1;
        }

        if (this.state.indexes.length > 0) {
            this.flatListRef.scrollToIndex({animated: true, index: this.state.indexes[this.state.onIndex]});
        }

        this.setState({onIndex: this.state.onIndex})
    };

    indexDown = () => {
        this.state.onIndex += 1;
        if (this.state.onIndex >= this.state.indexes.length) {
            this.state.onIndex = 0;
        }

        if (this.state.indexes.length > 0) {
            this.flatListRef.scrollToIndex({animated: true, index: this.state.indexes[this.state.onIndex]});
        }

        this.setState({onIndex: this.state.onIndex})
    };

    render() {
        return (
            <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>

            <View style = {styles.headerContainer}>
            <StatusBar barStyle= "light-content" />
                <View style = {{height: 40}}></View>
                <View style = {{justifyContent: 'space-between', alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: 20}}>
                    <View style = {{width: 100}}>
                    <TouchableOpacity
                    style = {{height: 30, width: 50, marginHorizontal: 5, alignItems: 'flex-start'}}
                    onPress={() => this.goBack()}>
                        <Icon name = 'keyboard-arrow-left' size={35} color='white'/>
                    </TouchableOpacity>
                    </View>

                    <View>
                        <Text style = {{color: 'white', height: 20, fontSize: 18}}>+{globalSpeakingTo}</Text>
                    </View>

                    <View style = {{flexDirection: 'row', width: 100}}>
                        <TouchableOpacity
                        style = {{height: 30, width: 30, marginHorizontal: 12,}}
                        onPress={() => this.handleEmail()}>
                            <Icon name = 'email' size={30} color='white'/>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style = {{height: 30, width: 30, marginHorizontal: 12,}}
                        onPress={() => this.searchBar.show()}>
                        <Icon name="search" size={30} color='white' />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <FlatList
            data = {this.state.data}
            extraData={this.state.refresh}
            showsVerticalScrollIndicator={false}
            ref={(ref) => this.flatListRef = ref}
            renderItem={({ item }) => (
                <View style = {item.style}>
                <Text style = {{margin: 8, color: 'black', fontSize: 16}}>
                <Highlighter
                  highlightStyle={{backgroundColor: 'lightgray'}}
                  searchWords={[searchText]}
                  textToHighlight={item.line}
                />
                </Text>
                </View>
            )}

            keyExtractor={(item, index) => index.toString()}
            />

            {this.state.showKeyboard && this.state.showKeyboard == true
            ? /* When keyboard is shown */
            <Animated.View>
                <View style = {{height: 40, backgroundColor: 'lightgray', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'gray'}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 0}}>
                        <Icon name="keyboard-arrow-up" size={40} color='gray' onPress={() => this.indexUp()}/>
                        <Icon name="keyboard-arrow-down" size={40} color='gray' onPress={() => this.indexDown()}/>
                        <Text style = {{textAlign: 'center', marginLeft: 10, color: 'gray', fontWeight: 'bold'}}>{this.state.indexes.length == 0 ? 0 : this.state.onIndex + 1} of {this.state.indexes.length} matches</Text>
                    </View>
                </View>
            </Animated.View>
            : /* When keyboard is hidden */
            <View style = {{height:0}}/>
            }


            </KeyboardAvoidingView>

                <SearchBar
                iOSPaddingBackgroundColor= '#4b8ea7'
                ref={(ref) => this.searchBar = ref}
                data={this.state.data}
                handleChangeText={this.updateSearchText}
                onSubmitEditing={this.handleSearchResults}
                onBack={this.clearSearchResults}
                heightAdjust={-7}
                autoCorrect={false}
                iOSHideShadow={true}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    transcript: {
        backgroundColor: '#fff',
        // borderRadius: 20,
        flex: 1
    },
    transcriptText: {
        margin: 10,
        fontSize: 18,
    },
    emailButton: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 35,
        borderColor: COLOR.PRIMARY,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'transparent',
    },
    backButton: {
        marginVertical: 10,
        height: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginHorizontal: 50,
        borderWidth: 2,
        borderColor: COLOR.PRIMARY,
    },
    buttonText: {
        textAlign: 'center',
        color : COLOR.PRIMARY,
        fontWeight: 'bold',
        fontSize: 18
    },
    listitem: {
        borderColor: 'gray',
        borderBottomWidth: 2,
        backgroundColor: 'white',
    },
    speaker1: {
        backgroundColor: '#ecf0f1',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        borderWidth: 0,
        borderColor: COLOR.PRIMARY,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginRight: 100,
        marginVertical: 5,
    },
    speaker2: {
        backgroundColor: '#ecf0f1',
        borderWidth: 0,
        borderColor: COLOR.PRIMARY,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginLeft: 100,
        marginRight: 10,
        marginVertical: 5,
    },
    headerContainer: {
        height: 65,
        backgroundColor: COLOR.PRIMARY_DARK,
        borderBottomWidth: 0,
        borderColor: 'gray',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
    }
});
