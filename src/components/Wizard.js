import React, { Component } from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';

const Step = props => (
  <View style={{ flex: 1 }}>
    {props.children}
    <Button title="Prev" disabled={props.currentIndex === 0} onPress={props.prevStep} />
    <Button title="Next" disabled={props.isLast} onPress={props.nextStep} />
  </View>
);

Step.propTypes = {
  children: PropTypes.node.isRequired,
  currentIndex: PropTypes.number.isRequired,
  prevStep: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
  nextStep: PropTypes.func.isRequired,
};

export default class Wizard extends Component {
  static Step = props => <Step {...props} />;

  state = {
    index: 0,
  };

  _nextStep = () => {
    if (this.state.index !== this.props.children.length - 1) {
      this.setState(prevState => ({
        index: prevState.index + 1,
      }));
    }
  };

  _prevStep = () => {
    if (this.state.index !== 0) {
      this.setState(prevState => ({
        index: prevState.index - 1,
      }));
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {React.Children.map(this.props.children, (el, index) => {
          if (index === this.state.index) {
            return React.cloneElement(el, {
              currentIndex: this.state.index,
              nextStep: this._nextStep,
              prevStep: this._prevStep,
              isLast: this.state.index === this.props.children.length - 1,
            });
          }

          return null;
        })}
      </View>
    );
  }
}

Wizard.propTypes = {
  children: PropTypes.node.isRequired,
};
