'use strict';

import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    PermissionsAndroid,
    Platform,
    StyleSheet
} from 'react-native';

import CallButton from '../../components/CallButton';
import CallManager from '../../manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import COLOR from '../../styles/Color';
import styles from '../../styles/Styles';

export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);

        this.state = {
            displayName: null
        }
    }

    componentDidMount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            this.call = null;
        }
    }

    async answerCall(withVideo) {
        try {
            if (Platform.OS === 'android') {
                let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                if (withVideo) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                }
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                if (recordAudioGranted) {
                    if (withVideo && !cameraGranted) {
                        console.warn('IncomingCallScreen: answerCall: camera permission is not granted');
                        return;
                    }
                } else {
                    console.warn('IncomingCallScreen: answerCall: record audio permission is not granted');
                    return;
                }
            }
        } catch (e) {
            console.warn('IncomingCallScreen: asnwerCall:' + e);
            return;
        }
        this.props.navigation.navigate('Call', {
            callId: this.call.callId,
            isVideo: withVideo,
            isIncoming: true
        });
    }

    declineCall() {
        this.call.decline();
        CallManager.getInstance().removeCall(this.call);
    }

    _onCallDisconnected = (event) => {
        CallManager.getInstance().removeCall(event.call);
        this.props.navigation.navigate("App");
    };

    _onCallEndpointAdded = (event) => {
        console.log('IncomingCallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({displayName: event.endpoint.displayName});
    };

    render() {
        return (
            <View style={styles.container}>
                <View style = {stylesLocal.container}>
                  <Text style={stylesLocal.incoming_call}>Incoming call from:</Text>
                  <Text style={stylesLocal.incoming_call}>{this.state.displayName}</Text>
                </View>
                <View style = {{flexDirection: 'column', justifyContent: 'flex-end', flex: 1}}>
                <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'center', marginBottom: 15}}>
                    <CallButton icon_name='call' color={'#292929'} buttonPressed={() => this.answerCall(false)} />
                    <View style = {{width: 150}}/>
                    <CallButton icon_name='call-end' color={'red'} buttonPressed={() => this.declineCall()} />
                </View>
                </View>
            </View>
        );
    }
}
const stylesLocal = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  incoming_call: {
    color: 'white',
    fontSize: 24,
    margin: 5,
  },
});
