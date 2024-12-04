import React, { Component } from 'react';

import { connect } from 'react-redux';

import { endCall } from '../../redux/actions/phonecall'
import IncomingVideoCallScreen from './IncomingVideoCallScreen';

class IncomingVideoCallScreenContainer extends Component {
  render() {
    const { navigation, endCallFn } = this.props;
    const callUUID = navigation.getParam('callUUID');
    const callId = navigation.getParam('callId');
    const participantName = navigation.getParam('participantName');
    const channelName = navigation.getParam('channelName');
    return (
      <IncomingVideoCallScreen
        navigation={navigation}
        endCall={endCallFn}
        callUUID={callUUID}
        callId={callId}
        participantName={participantName}
        channelName={channelName}
      />
    );
  }
}

const mapDispatchToProps = {
  endCallFn: endCall,
}

export default connect(null, mapDispatchToProps)(IncomingVideoCallScreenContainer);
