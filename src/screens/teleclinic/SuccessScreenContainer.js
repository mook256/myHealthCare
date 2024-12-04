import React, {Component} from 'react';
import SuccessScreen from './SuccessScreen';

export class SuccessScreenContainer extends Component {
  render() {
    const {navigation} = this.props;
    return <SuccessScreen navigation={navigation} />;
  }
}

export default SuccessScreenContainer;
