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
} from 'react-native';

import DefaultPreference from 'react-native-default-preference';
import SendCode from './ForgotPass';
import styles from '../../styles/Styles';
import COLOR from '../../styles/Color';

let _this;

export default class VerifyPass extends Component {
  static navigationOptions = {
    tabBarVisible: false
  }
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            phoneNumber: globalPhoneNumber,
            country: globalCountry,
            buttonDisabled: true,
        }
    }

    componentDidMount() {
        _this = this;
        setTimeout(() => {this.setState({buttonDisabled: false})}, 10000)
    }

    /*
        Twilio and Authy HTTP API call to verify the sent Verification Code
        TODO: Hide Api-Key!
    */
    checkCode(country_code, phone_number, code) {
        console.log("In checkCode");
        console.log(country_code, phone_number, code);
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                /*
                    Verification Code is correct
                */
                console.log('success', request.responseText);
                Alert.alert('Success!', 'You have successfully verified your phone number');

                /*
                    Navigate to user creation page
                */
                this.props.navigation.navigate('ForgotChangePassword');

            } else {
                /*
                    Verification Code is incorrect
                */
                Alert.alert('Error!', 'Wrong code or phone number!');

                {/*TODO: REMOVE THIS LINE!!!*/}
                this.props.navigation.navigate('ForgotChangePassword');
            }
        };

        request.open('GET', "https://api.authy.com/protected/json/phones/verification/check?phone_number=" + phone_number + "&country_code=" + country_code + "&verification_code=" + code);
        request.setRequestHeader("X-Authy-Api-Key", "D2vbAHKzbD8q727fMY8wCh2Ajsb1rahN");
        request.send();
    }

    updatePhoneNumber(text) {
        this.setState({phoneNumber: text});
    }

    goBack() {
        this.props.navigation.navigate('ForgotPass');
    }

    render() {
        let headerText = `What's your verification code?`;

        return (
            <View style={styles.container}>
            <Text style={stylesIndividual.header}>{headerText}</Text>
                <View style={stylesIndividual.form}>

                    <View style={{ flexDirection: 'row' }}>

                    <TextInput style = {stylesIndividual.textInput}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    placeholder = "_  _  _  _  _  _"
                    value = { this.state.code }
                    autoCapitalize={ 'none' }
                    autoCorrect={ false }
                    autoFocus={ true }
                    autoCapitalize = 'none'
                    autoFocus
                    placeholderTextColor= "#b9e0ee"
                    autoCorrect = { false }
                    onChangeText = { (code) => this.setState({code}) }
                    blurOnSubmit = { false }
                    maxLength = { 6 } />

                    </View>

                <TouchableOpacity style={styles.button} onPress={() => this.checkCode(this.state.country, this.state.phoneNumber, this.state.code)}>
                    <Text style={styles.buttonText}>Verify Confirmation Code</Text>
                </TouchableOpacity>

                <TouchableOpacity style={this.state.buttonDisabled?stylesIndividual.disabledButton:styles.button} disabled={this.state.buttonDisabled} onPress={() => this.goBack()}>
                    <Text style={styles.buttonText}>Did not receive a code?</Text>
                </TouchableOpacity>
                <Text style = {{textAlign: 'center', marginTop: -10, color: 'white'}}>Disabled for 10 seconds</Text>

                </View>
            </View>
        );
    }

}

const stylesIndividual = StyleSheet.create({
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 22,
        margin: 20,
        color: 'white',
    },
    form: {
        margin: 20,
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 40,
        color: 'white',
        textAlign: 'center',
    },
    disabledButton: {
        marginVertical: 10,
        height: 50,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginHorizontal: 40,
        borderWidth: 2,
        borderColor: COLOR.BORDER,
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: '#292929',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10,
        paddingLeft: 5
    }
});
