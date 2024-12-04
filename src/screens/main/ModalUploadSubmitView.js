import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withTranslation } from 'react-i18next';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class ModalUploadSubmitView extends Component {
  state = {
    dimensions: {
      window: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      },
      screen: screenDimensions,
    },
  };
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };
  componentDidMount() {
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
  }
  componentWillUnmount() {
    if (this.manager) {
      this.manager.destroy();
    }
    this.dimensionsSubscription?.remove();
  }
  render() {
    const { onCancel, onSubmit, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            { width: WidthMoreThenHeight ? 600 : width * 0.9, height: 200 },
          ]}>
          <View style={styles.topPanel}>
            <View style={styles.titlePanel}>
              <Text
                style={[
                  styles.titleText,
                  { fontSize: WidthMoreThenHeight ? 20 : 18 },
                ]}>
                {t('sendDataSuccess')}
              </Text>
            </View>
          </View>
          <View style={styles.buttomPanel}>
            <View style={styles.btnPanel}>
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  { width: WidthMoreThenHeight ? 150 : 100 },
                ]}
                onPress={onCancel}>
                <Text
                  style={[
                    styles.btnText,
                    { fontSize: WidthMoreThenHeight ? 20 : 18 },
                  ]}>
                  {t('common:no')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.acceptBtn,
                  { width: WidthMoreThenHeight ? 150 : 100 },
                ]}
                onPress={onSubmit}>
                <Text
                  style={[
                    styles.btnText,
                    { fontSize: WidthMoreThenHeight ? 20 : 18 },
                  ]}>
                  {t('common:yes')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topPanel: {
    flex: 1,
  },
  buttomPanel: {
    flex: 1,
    flexDirection: 'row',
  },
  titlePanel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleIcon: {
    marginLeft: 15,
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredKeyboardView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    width: 600,
    height: 200,
    flexDirection: 'column',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
  },
  inputPanel: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    width: 75,
    borderBottomWidth: 4,
    borderColor: 'grey',
    marginRight: 20,
  },
  textInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
  },
  pillbox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'grey',
    color: 'white',
  },
  btnPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    width: 150,
    backgroundColor: '#ff2014',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  acceptBtn: {
    width: 150,
    backgroundColor: '#25a18d',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default withTranslation(['mainScreen', 'common'])(ModalUploadSubmitView);
