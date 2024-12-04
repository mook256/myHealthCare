import { createReduxContainer } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import RootNavigator from '../navigators';

const AppNavigator = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

export default connect(mapStateToProps)(AppNavigator);
