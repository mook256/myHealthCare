import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';

export default class LoadingScreen extends Component {
  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    const { loadSystem } = this.props;
    loadSystem();
  };
  render() {
    const { config, t } = this.props;
    const { error } = config;
    return (
      <View style={styles.container}>
        {error == null ? (
          // <ActivityIndicator size="large" color="black" />
          true
        ) : (
          <>
            <Text style={styles.errorText}>{error ?? ''}</Text>
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={() => RNRestart.Restart()}>
              <Text style={styles.restartBtnText}>{t('Restart')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    fontWeight: '700',
  },
  restartBtn: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 16,
  },
  restartBtnText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
});
