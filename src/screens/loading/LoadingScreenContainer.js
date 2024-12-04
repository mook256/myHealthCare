import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import { loadSystem } from '../../redux/actions/config';
import { withTranslation } from 'react-i18next';

class LoadingScreenContainer extends Component {
  render() {
    const { loadSystem, config, t } = this.props;
    return <LoadingScreen loadSystem={loadSystem} config={config} t={t} />;
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = {
  loadSystem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation('common')(LoadingScreenContainer));
