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
    StatusBar,
} from 'react-native';

import CountryPicker from 'react-native-country-picker-modal';
import DefaultPreference from 'react-native-default-preference';
import styles from '../../styles/Styles';
import COLOR from '../../styles/Color';
let _this;

/*
    const brandColor defined for styling
*/

export default class LoginScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false
  }
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            /*
                Edit these for default values on country picking during Phone Verification
            */
            country: {
                cca2: 'TR',
                callingCode: '90',
            }
        }
    }

    componentDidMount() {
        _this = this;
    }

    /*
        Twilio and Authy HTTP API call to send Verification Code
        TODO: Hide Api-Key!
    */
    checkPhone(country_code, phone_number, language) {
        console.log("In checkPhone");
        console.log(country_code, phone_number, language)
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                /*
                    SMS has been sent
                */
                console.log('success', request.responseText);
                Alert.alert('Sent!', "We've sent you a verification code", [{
                    text: 'OK',
                }]);
                /*
                    Navigate to verification page
                */
                globalPhoneNumber = this.state.phoneNumber;
                globalCountry = this.state.country.callingCode;
                globalUsernameValue = globalCountry + globalPhoneNumber;
                this.props.navigation.navigate('VerifyPass');
            } else {
                /*
                    SMS could not be sent
                */
                Alert.alert('Error!', "Wrong number?", [{
                    text: 'OK',
                }]);

                {/*TODO: REMOVE THESE 3 LINES!!!*/}
                global.globalPhoneNumber = this.state.phoneNumber;
                global.globalCountry = this.state.country.callingCode;
                this.props.navigation.navigate('VerifyPass');
            }
        };
        request.open('POST', "https://api.authy.com/protected/json/phones/verification/start?via=sms&phone_number=" + phone_number + "&country_code=" + country_code + "&code_length=6&locale=" + language);
        request.setRequestHeader("X-Authy-Api-Key", "D2vbAHKzbD8q727fMY8wCh2Ajsb1rahN");
        request.send();
    }

    _changeCountry = (country) => {
        this.setState({ country });
        //this.refs.form.refs.textInput.focus();
    }

    updatePhoneNumber(text) {
        this.setState({phoneNumber: text});
    }

    /*
        CountryPicker from react-native-country-picker-modal
    */
    _renderCountryPicker = () => {
        return (
            <CountryPicker
            ref={'countryPicker'}
            closeable
            style = {stylesIndividual.countryPicker}
            onChange = {this._changeCountry}
            cca2 = {this.state.country.cca2}
            translation = 'eng'/>
        );

    }

    _renderCallingCode = () => {
        return (
            <View style={stylesIndividual.callingCodeView}>
                <Text style={stylesIndividual.callingCodeText}>+{this.state.country.callingCode}</Text>
            </View>
        );

    }

    _renderFooter = () => {
        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send Confirmation Code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    getPhoneNumber() {
        return this.state.phoneNumber;
    }

    goBack() {
        this.props.navigation.navigate('Login');
    }

    render() {
        let headerText = `Forgot your Password?`;

        return (
            <View style={stylesIndividual.container}>
            <StatusBar barStyle= "light-content" />
            <Text style={stylesIndividual.header}>{headerText}</Text>
                <View style={stylesIndividual.form}>

                    <View style={{ flexDirection: 'row' }}>
                    {this._renderCountryPicker()}
                    {this._renderCallingCode()}

                    <TextInput style = {stylesIndividual.textInput}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    placeholder = "Phone Number"
                    value = { this.state.phoneNumber }
                    autoCapitalize={ 'none' }
                    autoCorrect={ false }
                    autoFocus={ true }
                    autoCapitalize = 'none'
                    autoFocus
                    placeholderTextColor= "#b9e0ee"
                    autoCorrect = { false }
                    onChangeText = { (phoneNumber) => this.setState({phoneNumber}) }
                    blurOnSubmit = { false }
                    maxLength = { 10 } />
                    </View>

                <TouchableOpacity style={styles.button} onPress={() => this.checkPhone(this.state.country.callingCode, this.state.phoneNumber, this.state.country.cca2)}>
                    <Text style={styles.buttonText}>Send Confirmation Code</Text>
                </TouchableOpacity>

                {this._renderFooter()}

                <TouchableOpacity style={styles.button} onPress={() => this.goBack()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const stylesIndividual = StyleSheet.create({
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#75b6ce',
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
        fontSize: 20,
        color: 'white',
    },
    disclaimerText: {
        fontSize: 12,
        color: '#b9e0ee'
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10,
        paddingLeft: 5
    }
});
