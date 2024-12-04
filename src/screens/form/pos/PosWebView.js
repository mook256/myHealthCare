import { Text, View } from 'react-native';
import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { FORM_POS_URL } from '../../../utils/constants';

export class PosWebView extends Component {
  render() {
    const {
      navigation,
      t,
      currentuser,
      user,
      config,
      authentication,
    } = this.props;
    const userid = currentuser?.userid;
    const partnerid = config?.config?.partner?.partnerid;
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{
            uri: FORM_POS_URL + '?userid=' + userid + '&partnerid=' + partnerid,
          }}
          scalesPageToFit
          useWebKit={Platform.OS !== 'ios'}
        />
      </View>
    );
  }
}

export default PosWebView;
