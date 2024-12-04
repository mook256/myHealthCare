import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

import i18n from '../../i18n';
import { LICENSE_AGREEMENT_URL } from '../../utils/constants';

class LicenseWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: i18n.language === 'en' ? 'en-TH' : 'th-TH',
    };
  }

  render() {
    const { language } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: LICENSE_AGREEMENT_URL + '?lang=' + language }}
          scalesPageToFit
          useWebKit={Platform.OS !== 'ios'}
        />
      </View>
    );
  }
}

export default LicenseWebView;
