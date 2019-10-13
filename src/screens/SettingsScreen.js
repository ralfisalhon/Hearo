'use strict';

import React, { Component } from 'react';
import {Container, Title, Content, Button, Left, Right, Body, Text,
   Grid,Col, Row, Footer, FooterTab, Item, Input, } from "native-base";
import { Platform, StyleSheet, View, Image, Alert } from "react-native";
import { Icon } from 'react-native-elements';
import LoginManager from '../manager/LoginManager.js'
import DefaultPreference from 'react-native-default-preference';
import CreateUser from './CreateUserActions/CreateUser.js';
import Header from '../components/Header';
import stylesGen from '../styles/Styles';
import Color from '../styles/Color'

let _this;

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
        title: "Settings",
        tabBarIcon: ({ tintColor }) => (
            <Icon name="settings" style={{ color: tintColor }} />
        ),
    }
    _goToLogin = () => {
        DefaultPreference.set('accessToken', undefined);
        LoginManager.getInstance().logout();
        this.props.navigation.navigate("Login");
    };
    _goToCredits = () => {
        this.props.navigation.navigate("Credits");
    };
    accountClicked = () => {
      // Alert.alert('Your password was correct.');
      this.props.navigation.navigate("AccountEdit");
    };

    constructor(props){
      super(props)
      this.state = {
        usernameValue: '',
      }
    }

    render() {
        return (
                <Container style={stylesGen.container}>
                <Header/>

                <View style = {{height: 22, borderColor: 'black', borderBottomWidth: 2}}>
                </View>

                <Button full style={[styles.settingsButton, {height: 120}]} onPress={this.accountClicked}>
                    <View>
                        <View style = {styles.settingsAvatar}>
                            <Icon name = 'person' size={64}/>
                        </View>
                    </View>
                    <View style = {{marginLeft: -5}}>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>+
                        {globalUsernameValue}
                        </Text>
                        <Text style = {{color: 'gray', margin: 2, fontWeight: 'bold'}}>{globalEmail}</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                <View style = {{height: 22}}>
                </View>

                {/* Transcriptions */}
                <Button full style={[styles.settingsButton, {height: 60, borderTopWidth: 2}]}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'library-books' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Transcriptions</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Notifications */}
                <Button full style={[styles.settingsButton, {height: 60}]}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'notifications-none' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Notifications</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>
                {/* Data and Storage */}
                <Button full style={[styles.settingsButton, {height: 60}]}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'data-usage' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Data and Storage</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Help */}
                <Button full style={[styles.settingsButton, {height: 60}]}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'help-outline' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Help</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Credits*/}
                <Button full style={[styles.settingsButton, {height: 60}]}onPress={this._goToCredits}>
                    <View style = {styles.settingsIcons}>
                        <Icon name = 'info' size={22}/>
                    </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Credits</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>

                {/* Log Out */}
                <Button full style={[styles.settingsButton, {height: 60}]} onPress={this._goToLogin}>
                <View style = {styles.settingsIcons}>
                    <Icon name = 'exit-to-app' size={22}/>
                </View>
                    <View>
                        <Text style = {{color: 'black', margin: 2, fontWeight: 'bold'}}>Logout</Text>
                    </View>
                    <View style = {styles.grayArrow}>
                        <Icon name = 'keyboard-arrow-right' size={40} color='gray'/>
                    </View>
                    <Row />
                </Button>
                </Container>
        );
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#75b6ce',
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
