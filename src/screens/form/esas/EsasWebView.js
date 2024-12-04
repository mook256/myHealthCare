import { Text, View } from 'react-native';
import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { FORM_ESAS_URL } from '../../../utils/constants';
export class EsasWebView extends Component {
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
    // console.log('currentuser', currentuser);
    // console.log('user', user);
    // console.log('config', config);
    // console.log('authentication', authentication);
    console.log('partnerid', partnerid);
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{
            uri:
              FORM_ESAS_URL + '?userid=' + userid + '&partnerid=' + partnerid,
          }}
          scalesPageToFit
          useWebKit={Platform.OS !== 'ios'}
        />
      </View>
    );
  }
}

export default EsasWebView;
