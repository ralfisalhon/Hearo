/*
* Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
*/

'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Header extends Component {
    render() {
        return (
            <View style = {styles.container}>
            <StatusBar barStyle= "light-content" />
                <View style = {{height: 16}}></View>
                <Text style = {styles.name}>
                    Hearo
                </Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        height: 65,
        backgroundColor: '#357382',
        borderBottomWidth: 0,
        borderColor: 'gray',
        justifyContent: 'center',
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
    }
});
