import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorBox from './ErrorBox';

class ErrorBoxContainer extends Component {
  render() {
    return <ErrorBox />;
  }
}

ErrorBoxContainer.propTypes = {};

// const mapStateToProps = state => ({});

// const mapDispatchToProps = {};

export default connect(
  null,
  // mapStateToProps,
  // mapDispatchToProps,
)(ErrorBoxContainer);
