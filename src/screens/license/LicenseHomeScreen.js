import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LicenseWebView from './LicenseWebView';

class LicenseHomeScreen extends Component {
  render() {
    const { navigation, t } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            marginVertical: 20,
            alignItems: 'center',
          }}>
          <Text style={styles.header}>{t('header')}</Text>
        </View>
        <LicenseWebView />
        <View>
          <TouchableOpacity
            style={[styles.btn, styles.btnDecline]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.btnText, styles.btnTextDecline]}>
              {t('common:back')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    color: '#2E2E2E',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: 'pink',
    padding: 15,
    margin: 5,
    borderRadius: 15,
  },
  btnAccept: {
    backgroundColor: '#27C3ED',
  },
  btnDecline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#27C3ED',
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnTextAccept: {
    color: '#fff',
  },
  btnTextDecline: {
    color: '#27C3ED',
  },
});

export default LicenseHomeScreen;
