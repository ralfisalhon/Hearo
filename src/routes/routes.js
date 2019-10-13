'use strict';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Splash from '../screens/Splash';
import LoginScreen from '../screens/LoginForm';
import MainScreen from '../screens/MainScreen';
import Settings from '../screens/SettingsScreen';
import CallScreen from '../screens/CallScreens/CallScreen';
import IncomingCallScreen from '../screens/CallScreens/IncomingCallScreen';
import CreateUser from '../screens/CreateUserActions/CreateUser';
import SendCode from '../screens/CreateUserActions/SendCode.js';
import VerifyCode from '../screens/CreateUserActions/VerifyCode.js';
import Transcripts from '../screens/TranscriptPages/Transcripts.js';
import TheTranscript from '../screens/TranscriptPages/TheTranscript.js';
import Credits from '../screens/Credits.js';
import ForgotPass from '../screens/ForgotPasswordActions/ForgotPass.js';
import VerifyPass from '../screens/ForgotPasswordActions/VerifyPass.js';
import ForgotChangePassword from '../screens/ForgotPasswordActions/ForgotChangePassword.js';
import AccountEdit from '../screens/AccountEdit.js';
import ChangePassword from '../screens/ChangePassword.js';
import ChangeEmail from '../screens/ChangeEmail.js';

import { FluidNavigator } from 'react-navigation-fluid-transitions';

import {createBottomTabNavigator} from 'react-navigation';

const TabStack = createBottomTabNavigator(
    {
        Main: MainScreen,
        Transcripts: Transcripts,
        Settings: Settings,
    },
    {
        initialRouteName: 'Main',
        gesturesEnabled: false,
    },
);

const RootStack = FluidNavigator(
    {
        Splash: Splash,
        Login: LoginScreen,
        App: TabStack,
        Call: CallScreen,
        IncomingCall: IncomingCallScreen,
        CreateUser: CreateUser,
        SendCode: SendCode,
        VerifyCode: VerifyCode,
        Main: MainScreen,
        TheTranscript: TheTranscript,
        Credits: Credits,
        VerifyPass: VerifyPass,
        ForgotPass: ForgotPass,
        ForgotChangePassword: ForgotChangePassword,
        ChangePassword: ChangePassword,
        AccountEdit: AccountEdit,
        ChangeEmail: ChangeEmail,
    },
    {
        initialRouteName: 'Splash',
        navigationOptions: {
            tabBarVisible: false,
            gesturesEnabled: false
        }
    }
);

export default RootStack;
