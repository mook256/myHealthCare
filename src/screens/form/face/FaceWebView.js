import { Text, View } from 'react-native';
import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { FORM_FACE_URL } from '../../../utils/constants';
export class FaceWebView extends Component {
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
            uri:
              FORM_FACE_URL + '?userid=' + userid + '&partnerid=' + partnerid,
          }}
          scalesPageToFit
          useWebKit={Platform.OS !== 'ios'}
        />
      </View>
    );
  }
}

export default FaceWebView;
