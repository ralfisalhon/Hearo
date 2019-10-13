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
    ScrollView,
} from 'react-native';
import styles from '../styles/Styles';

import Header from '../components/Header';


// https://www.npmjs.com/package/react-native-email
import email from 'react-native-email';

let _this;

export default class TheTranscript extends Component {
    static navigationOptions = {
        tabBarVisible: false
    }

    goBack = () => {
        this.props.navigation.navigate("Settings");
    };
    render() {
        return (
            <View style={styles.container}>
            <Header/>
            <View style = {stylesIndividual.credits}>
                <Text style = {stylesIndividual.creditsText}>Eytan Nahmiyas</Text>
                <Text style = {stylesIndividual.creditsText}>Ralfi Salhon</Text>
                <Text style = {stylesIndividual.creditsText}>Aaron Kaneti</Text>
            </View>

            <View style = {stylesIndividual.button}>
              <TouchableOpacity style={[styles.button]} onPress={() => this.goBack()}>
                  <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
              </View>

            </View>
        );
    }

}

const stylesIndividual = StyleSheet.create({
    credits:{
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    creditsText: {
        marginLeft: 5,
        marginTop: 5,
        fontSize: 24,
        color: 'white',
    },
    button: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
});
