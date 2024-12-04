import React, { Component } from 'react';

import InstructionVideoScreen from './InstructionVideoScreen';

class InstructionVideoScreenContainer extends Component {
  render() {
    const { navigation } = this.props;
    return <InstructionVideoScreen navigation={navigation} />;
  }
}

export default InstructionVideoScreenContainer;
