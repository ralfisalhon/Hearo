/*
    This file is unedited from https://github.com/voximplant/react-native-demo/blob/master/src/manager/LoginManager.js
    Date: Jul 27, 2018
*/

"use strict";

import React from "react";

import { Voximplant } from "react-native-voximplant";
import VoxImplant from "react-native-voximplant";
import DefaultPreference from "react-native-default-preference";
import PushManager from "./PushManager";
import CallManager from "./CallManager";
import md5 from "react-native-md5";

const handlersGlobal = {};

export default class LoginManager {
  static myInstance = null;
  client = null;
  displayName = "";
  fullUserName = "";
  myuser = "";
  username = "";
  password = "";

  static getInstance() {
    if (this.myInstance === null) {
      this.myInstance = new LoginManager();
    }
    return this.myInstance;
  }

  constructor() {
    this.client = Voximplant.getInstance();

    // Connection to the Voximplant Cloud is stayed alive on reloading of the app's
    // JavaScript code. Calling "disconnect" API here makes the SDK and app states
    // synchronized.
    PushManager.init();
    (async () => {
      try {
        // this.client.disconnect();
      } catch (e) {}
    })();
    // this.client.on(Voximplant.ClientEvents.ConnectionClosed, this._connectionClosed);

    this.loginToVox();
  }

  async loginToVox(user, password) {
    let state = await this.client.getClientState();
    if (state === Voximplant.ClientState.DISCONNECTED) {
      await this.client.connect();
    }
    this._emit("loggedin");
  }

  async loginWithPassword(user, password) {
    this.username = user;
    this.password = password;
    try {
      let state = await this.client.getClientState();
      if (state === Voximplant.ClientState.DISCONNECTED) {
        await this.client.connect();
      }
      let authResult = await this.client.login(user, password);
      this._processLoginSuccess(authResult);
    } catch (e) {
      console.log("LoginManager: loginWithPassword " + e.name + e.message);
      switch (e.name) {
        case Voximplant.ClientEvents.ConnectionFailed:
          this._emit("onConnectionFailed", e.message);
          break;
        case Voximplant.ClientEvents.AuthResult:
          this._emit("onLoginFailed", e.code);
          break;
      }
    }
  }

  createUser(username, email, password) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = e => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        console.log("success", request.responseText);
        this.loginWithPassword(username + "@APPLICATION_NAME.USERNAME.voximplant.com", password);
      } else {
        console.warn("Could not create user");
      }
    };

    request.open(
      "GET",
      "https://api.voximplant.com/platform_api/AddUser/?account_id=ACCOUNT_ID&api_key=API_KEY&user_name=" +
        username +
        "&user_display_name=" +
        email +
        "&user_password=" +
        password +
        "&application_name=APPLICATION_NAME"
    );
    request.send();
  }
  async loginWithOneTimeKey(user, password) {
    this.fullUserName = user;
    this.myuser = user.split("@")[0];
    this.password = password;
    try {
      let state = await this.client.getClientState();
      if (state === Voximplant.ClientState.DISCONNECTED) {
        await this.client.connect();
      }
      await this.client.requestOneTimeLoginKey(user);
    } catch (e) {
      console.log("LoginManager: loginWithPassword " + e.name);
      switch (e.name) {
        case Voximplant.ClientEvents.ConnectionFailed:
          this._emit("onConnectionFailed", e.message);
          break;
        case Voximplant.ClientEvents.AuthResult:
          if (e.code === 302) {
            let hash = md5.hex_md5(
              e.key + "|" + md5.hex_md5(this.myuser + ":voximplant.com:" + this.password)
            );
            try {
              let authResult = await this.client.loginWithOneTimeKey(this.fullUserName, hash);
              this._processLoginSuccess(authResult);
            } catch (e1) {
              this._emit("onLoginFailed", e1.code);
            }
          }
          break;
      }
    }
  }

  async loginWithToken() {
    // console.warn("IN loginWithToken");
    try {
      let state = await this.client.getClientState();
      if (state === Voximplant.ClientState.DISCONNECTED) {
        await this.client.connect();
      }
      if (state !== Voximplant.ClientState.LOGGED_IN) {
        const username = await DefaultPreference.get("usernameValue");
        const accessToken = await DefaultPreference.get("accessToken");
        console.log("LoginManager: loginWithToken: user: " + username + ", token: " + accessToken);
        const authResult = await this.client.loginWithToken(
          username + "@APPLICATION_NAME.USERNAME.voximplant.com",
          accessToken
        );
        this._processLoginSuccess(authResult);
      }
    } catch (e) {
      this._emit("tokenFailedLogin");
      // console.warn("COULD NOT LOG IN!");
      console.log("LoginManager: loginWithToken: " + e.name);
      if (e.name === Voximplant.ClientEvents.AuthResult) {
        console.log("LoginManager: loginWithToken: error code: " + e.code);
      }
    }
  }

  async logout() {
    this.unregisterPushToken();
    await this.client.disconnect();
    this._emit("onConnectionClosed");
  }

  registerPushToken() {
    this.client.registerPushNotificationsToken(PushManager.getPushToken());
  }

  unregisterPushToken() {
    this.client.unregisterPushNotificationsToken(PushManager.getPushToken());
  }

  pushNotificationReceived(notification) {
    (async () => {
      await this.loginWithToken();
      this.client.handlePushNotification(notification);
    })();
  }

  on(event, handler) {
    if (!handlersGlobal[event]) handlersGlobal[event] = [];
    handlersGlobal[event].push(handler);
  }

  off(event, handler) {
    if (handlersGlobal[event]) {
      handlersGlobal[event] = handlersGlobal[event].filter(v => v !== handler);
    }
  }

  _emit(event, ...args) {
    const handlers = handlersGlobal[event];
    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }

  _connectionClosed = () => {
    this._emit("onConnectionClosed");
  };

  _processLoginSuccess(authResult) {
    this.displayName = authResult.displayName;
    globalEmail = this.displayName;

    // save acceess and refresh token to default preferences to login using
    // access token on push notification, if the connection to Voximplant Cloud
    // is closed
    const loginTokens = authResult.tokens;
    if (loginTokens !== null) {
      DefaultPreference.set("accessToken", loginTokens.accessToken);
      // DefaultPreference.set('refreshToken', loginTokens.refreshToken);
      // DefaultPreference.set('accessExpire', loginTokens.accessExpire.toString());
      // DefaultPreference.set('refreshExpire', loginTokens.refreshExpire.toString());
    } else {
      console.error("LoginSuccessful: login tokens are invalid");
    }
    this.registerPushToken();
    CallManager.getInstance().init();
    this._emit("onLoggedIn", authResult.displayName);
  }
}

const loginManagerGlobal = LoginManager.getInstance();
