/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
  Platform,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  Button
} from 'react-native';

import RootStack from './src/routes/routes';
import NavigationService from './src/routes/NavigationService';

global.globalEmail = "";
global.globalUsernameValue = "";
global.globalPhoneNumber = "";
global.globalCountry = "";
global.globalUser_ID = "";

export default class App extends React.Component {
  render() {
    return <RootStack
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />;
  }
}
