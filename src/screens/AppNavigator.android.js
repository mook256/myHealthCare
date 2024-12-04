import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import RootNavigator from '../navigators';

const Navigator = createReduxContainer(RootNavigator);

type Props = {
  state: Object,
};

class AppNavigator extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    // const { dispatch, state } = this.props;
    // if (state.index === 0) {
    //   return false;
    // }

    // dispatch(NavigationActions.back());
    // return true;
    return true;
  };

  render() {
    return <Navigator {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  state: state.nav,
});

export default connect(mapStateToProps)(AppNavigator);
