'use strict';

import React, { Component } from 'react';
import {Container, Title, Content, Button, Left, Right, Body, Text,
   Grid,Col, Row, Footer, FooterTab, Item, Input, } from "native-base";
import { Platform, StyleSheet, View, Image, TouchableOpacity, } from "react-native";
import { Icon } from 'react-native-elements';
import LoginManager from '../manager/LoginManager.js'
import DefaultPreference from 'react-native-default-preference';
import CreateUser from './CreateUserActions/CreateUser.js';
import Header from '../components/Header';
import stylesGen from '../styles/Styles';
import COLOR from '../styles/Color';

let _this;

export default class AccountEdit extends React.Component {
  static navigationOptions = {
        title: "Settings",
        tabBarIcon: ({ tintColor }) => (
            <Icon name="settings" style={{ color: tintColor }} />
        )
    }
    _goToSettings = () => {
        this.props.navigation.navigate("Settings");
    };
    _gotoPass = () => {
        this.props.navigation.navigate("ChangePassword");
    };
    _gotoEmail = () => {
        this.props.navigation.navigate("ChangeEmail");
    };

    constructor(props){
      super(props)
      this.state = {
        usernameValue: '',
      }
    }

    render() {
        return (
                <Container style={styles.background}>
                <Header/>

                <View style = {{height: 22}}>
                </View>

                {/* Email */}
                <Button full style={[styles.settingsButton, {height: 60, borderTopWidth: 2}]} onPress={this._gotoEmail}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'email' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Change Email</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Password */}
                <Button full style={[styles.settingsButton, {height: 60}]} onPress={this._gotoPass}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'lock-open' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Change Password</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Back To Settings*/}
                <View style={styles.Padding}>
                    <TouchableOpacity style={stylesGen.button} icon_name='call' onPress={this._goToSettings}>
                        <Text style={stylesGen.buttonText}>Back to Settings</Text>
                    </TouchableOpacity>
                </View>
                </Container>
        );
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLOR.PRIMARY,
    },
    Padding: {
      justifyContent: 'flex-end',
      flexDirection: 'column',
      flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsButton: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'black',
        borderBottomWidth: 2,
    },
    settingsAvatar: {
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 1.5,
        marginLeft: 10
    },
    settingsIcons: {
        marginLeft: 10,
    },
    grayArrow: {
        flex: 250,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});
