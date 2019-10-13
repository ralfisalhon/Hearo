'use strict';

import React, { Component } from 'react';
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
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import LoginManager from '../manager/LoginManager';
import DefaultPreference from 'react-native-default-preference';
import styles from '../styles/Styles';
import Header from '../components/Header';
import COLOR from '../styles/Color';
import routes from '../routes/routes';

let _this;

export default class Splash extends Component {
    constructor() {
        super();
        global.globalHearoLogo = require('../assets/images/HearoLogo.png');
    }

    componentWillMount() {
        _this = this;
    }

    componentDidMount() {
        LoginManager.getInstance().on('loggedin', this.voxConnected);
        LoginManager.getInstance().on('onLoggedIn', (param) => this.onLoggedIn());
        LoginManager.getInstance().on('tokenFailedLogin', (param) => this.onTokenFailed());
        this.props.navigation.navigate('Login');
    }

    voxConnected = () => {
        DefaultPreference.get('usernameValue').then(function(value) {
            if (value != undefined) {
                LoginManager.getInstance().loginWithToken();
            }
        });

        // this.props.navigation.navigate('Login');
    }

    onTokenFailed = () => {
        this.props.navigation.navigate('Login');
    }

    onLoggedIn = () => {
        DefaultPreference.get('usernameValue').then(function(value) {
            globalUsernameValue = value;
        });

        this.props.navigation.navigate('App');
    }

    render() {
        return (
            <View style = {stylesIndividual.container}>
                <StatusBar barStyle= "light-content" />

                <ActivityIndicator size="large" color="#fff" />

                <Text style = {stylesIndividual.loadingText}>
                Connecting...
                </Text>
            </View>
        );
    }
}

const stylesIndividual = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLOR.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        padding: 10,
    },
})
