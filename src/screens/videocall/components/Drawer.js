/* eslint-disable */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
/* eslint-disable no-var */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable arrow-body-style */
/* eslint-disable vars-on-top */
/* eslint-disable max-len */
import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
// import PropTypes from 'prop-types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Drawer extends Component {
  constructor(props) {
    super(props);
    var finalDrawerSize = this.props.finalDrawerHeight
      ? this.props.finalDrawerHeight
      : 0;
    const initialDrawerSize = (SCREEN_HEIGHT * 82) / 100;
    this.state = {
      touched: 'FALSE',
      position: new Animated.Value(initialDrawerSize),
      initialPositon: initialDrawerSize,
      finalPosition: finalDrawerSize,
      bounceValue: new Animated.Value(0),
    };
  }

  UNSAFE_componentWillMount() {
    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          this.isAValidMovement(gestureState.dx, gestureState.dy) &&
          this.state.touched === 'TRUE'
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        this.moveDrawerView(gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.moveFinished(gestureState);
      },
    });
  }

  componentDidUpdate(prevProps) {
    const {hidden} = this.props;
    if (prevProps.hidden !== hidden) {
      if (hidden) {
        Animated.spring(this.state.bounceValue, {
          toValue: 150,
          velocity: 3,
          tension: 2,
          friction: 8,
        }).start();
      } else {
        Animated.spring(this.state.bounceValue, {
          toValue: 0,
          velocity: 3,
          tension: 2,
          friction: 8,
        }).start();
      }
    }
  }

  isAValidMovement = (distanceX, distanceY) => {
    const moveTravelledFarEnough =
      Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 2;
    return moveTravelledFarEnough;
  };

  startAnimation = (
    velocityY,
    positionY,
    initialPositon,
    id,
    finalPosition,
  ) => {
    var isGoingToUp = velocityY < 0 ? true : false;
    var endPosition = isGoingToUp ? finalPosition + 50 : initialPositon + 50;

    var position = new Animated.Value(positionY);
    position.removeAllListeners();

    Animated.timing(position, {
      toValue: endPosition,
      tension: 30,
      friction: 0,
      velocity: velocityY,
    }).start();

    position.addListener((pos) => {
      if (!this.center) return;
      this.onUpdatePosition(pos.value);
    });
  };

  onUpdatePosition(position) {
    const {detectDrawerStatus} = this.props;
    position = position - 50;
    this.state.position.setValue(position);
    this._previousTop = position;
    const {initialPosition} = this.state;

    if (initialPosition === position) {
      this.props.onInitialPositionReached &&
        this.props.onInitialPositionReached();
    }

    if (position === (SCREEN_HEIGHT * 82) / 100) {
      detectDrawerStatus('down');
    } else {
      detectDrawerStatus('up');
    }

    // if (position === (SCREEN_HEIGHT * 18) / 100) {
    //   detectDrawerStatus('up');
    // }
  }

  moveDrawerView(gestureState) {
    if (!this.center) return;
    const position = gestureState.moveY - SCREEN_HEIGHT * 0.05;
    this.onUpdatePosition(position);
  }

  moveFinished(gestureState) {
    const isGoingToUp = gestureState.vy < 0;
    if (!this.center) return;
    this.startAnimation(
      gestureState.vy,
      gestureState.moveY,
      this.state.initialPositon,
      gestureState.stateId,
      this.state.finalPosition,
    );
    this.props.onRelease && this.props.onRelease(isGoingToUp);
  }

  renderTouchableDrawer() {
    const {peerIds, renderInitDrawerView} = this.props;
    const initDrawerView = renderInitDrawerView ? renderInitDrawerView() : null;

    // if (peerIds.length > 0) {
    //   return (
    //     <TouchableWithoutFeedback
    //       onPressIn={() => {
    //         this.setState({ touched: 'TRUE' });
    //       }}
    //       onPressOut={() => {
    //         this.setState({ touched: 'FALSE' });
    //       }}
    //     >
    //       {initDrawerView}
    //     </TouchableWithoutFeedback>
    //   );
    // }
    return initDrawerView;
  }

  renderStatusBar() {
    return <StatusBar hidden />;
  }

  render() {
    const {bounceValue, position} = this.state;
    const {renderContainerView, renderDrawerView} = this.props;

    const containerView = renderContainerView ? renderContainerView() : null;
    const drawerView = renderDrawerView ? renderDrawerView() : null;

    const drawerPosition = {
      top: position,
    };

    // console.log("ss",(SCREEN_HEIGHT * 18) / 100)

    return (
      <View style={styles.viewport}>
        <View style={styles.container}>{containerView}</View>
        <Animated.View
          style={[
            drawerPosition,
            styles.drawer,
            {transform: [{translateY: bounceValue}]},
          ]}
          ref={(center) => (this.center = center)}
          {...this._panGesture.panHandlers}>
          {this.renderTouchableDrawer()}
          {drawerView}
        </Animated.View>
        {this.renderStatusBar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    alignItems: 'center',
  },
  drawer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(255,255,255,0)',
    // opacity: 0.95,
    marginBottom: -200,
    width: '60%',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

// Drawer.propTypes = {
//   renderDrawerView: PropTypes.any.isRequired,
//   renderContainerView: PropTypes.any.isRequired,
//   hidden: PropTypes.any.isRequired,
//   renderInitDrawerView: PropTypes.any.isRequired,
//   peerIds: PropTypes.any.isRequired,
//   onRelease: PropTypes.any.isRequired,
//   onInitialPositionReached: PropTypes.any.isRequired,
//   detectDrawerStatus: PropTypes.any.isRequired,
//   finalDrawerHeight: PropTypes.any.isRequired,
// };
