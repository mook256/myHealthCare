import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from 'react-native';

import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import { healthForm } from '../../utils/healthForm';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const NUMBER_RE = /^\d*\.?\d*$/g;
class ModalDynamicView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        window: {
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        },
        screen: screenDimensions,
      },
    };
  }
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
    this.dimensionsSubscription?.remove();
  }
  handleChangeValue = (field) => (value) => {
    if (value.match(NUMBER_RE)) {
      this.setState({ [field]: value });
    }
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleSubmit = () => {
    const { onSubmit, type } = this.props;
    const values = healthForm[type].fields
      .map((field) => field.name)
      .reduce((acc, n) => {
        const value = this.state[n];
        if (
          value == null ||
          (typeof value === 'string' && value.length === 0)
        ) {
          return acc;
        }
        return { ...acc, [n]: Number(value) };
      }, {});
    onSubmit(values);
  };

  handleClear = () => {
    const { t, type, onSubmit } = this.props;
    Alert.alert(
      t('mainScreen:confirmResetDataHeader'),
      t('mainScreen:confirmResetDataConfirm', {
        fieldName: t(`healthForm:${type}.name`),
      }),
      [
        {
          text: t('common:no'),
          style: 'cancel',
        },
        {
          text: t('common:yes'),
          onPress: () => {
            const values = healthForm[type].fields
              .map((field) => field.name)
              .reduce((acc, n) => {
                return { ...acc, [n]: 0 };
              }, {});
            onSubmit(values);
          },
        },
      ],
    );
  };

  render() {
    const { type, maxLength, healthRecord, t } = this.props;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    const form = healthForm[type];
    const formNames = form.fields.map((f) => f.name);
    const records = formNames.reduce((acc, name) => {
      if (healthRecord.hasOwnProperty(name)) {
        return { ...acc, [name]: healthRecord[name] };
      }
      return acc;
    }, {});
    return (
      <KeyboardAvoidingView style={styles.centeredView} behavior={'padding'}>
        {WidthMoreThenHeight ? (
          <>
            <View style={styles.modalView}>
              <View style={styles.leftPanel}>
                <View style={styles.titlePanel}>
                  <Text style={styles.titleText}>{t(form.iconTitle)}</Text>
                  <FontAwesome
                    name={form.icon}
                    style={[
                      styles.titleIcon,
                      { marginRight: 5, color: form.iconColor },
                    ]}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}>
                    {form.fields.map((field, i) => [
                      i > 0 && !field?.title && (
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                            marginRight: 5,
                          }}>
                          /
                        </Text>
                      ),
                      field?.title && (
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingRight: 10,
                          }}>
                          {`${t(field.title)}:`}
                        </Text>
                      ),
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: 'bold',
                          paddingRight: 10,
                        }}>
                        {records[field.name]}
                      </Text>,
                    ])}
                  </View>
                  <Text style={styles.pillbox}>{t(form.unit)}</Text>
                </View>
                {form.editable ? (
                  <View style={styles.inputPanel}>
                    {form.fields.map((field, i) => [
                      i > 0 && !field?.title && (
                        <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                          /
                        </Text>
                      ),
                      field?.title && (
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingRight: 10,
                          }}>
                          {`${t(field.title)}:`}
                        </Text>
                      ),
                      <View style={styles.textInputContainer}>
                        <TextInput
                          style={styles.textInput}
                          keyboardType={'decimal-pad'}
                          maxLength={
                            type === 'weight'
                              ? maxLength
                              : type === 'temp'
                              ? 4
                              : 3
                          }
                          value={this.state[field.name]}
                          onChangeText={this.handleChangeValue(field.name)}
                        />
                      </View>,
                    ])}
                    <Text style={styles.pillbox}>{t(form.unit)}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.rightPanel}>
                <View style={styles.btnPanel}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={this.handleCancel}>
                    <Text style={styles.btnText}>{t('common:cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={this.handleClear}>
                    <Text style={styles.btnText}>{t('common:clear')}</Text>
                  </TouchableOpacity>
                  {form.editable ? (
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={this.handleSubmit}>
                      <Text style={styles.btnText}>{t('common:confirm')}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 30,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                justifyContent: 'space-between',
                alignItems: 'stretch',
                width: width * 0.9,
                height: width > 400 ? height * 0.4 : height * 0.5,
              }}>
              <View style={styles.leftPanel}>
                <View style={styles.titlePanel}>
                  <Text
                    style={[
                      styles.titleText,
                      { fontSize: width > 400 ? 20 : 18 },
                    ]}>
                    {t(form.iconTitle)}
                  </Text>
                  <FontAwesome
                    name={form.icon}
                    style={[
                      styles.titleIcon,
                      { marginRight: 5, color: form.iconColor },
                    ]}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}>
                    {form.fields.map((field, i) => [
                      i > 0 && !field?.title && (
                        <Text
                          style={{
                            fontSize: width > 400 ? 30 : 20,
                            fontWeight: 'bold',
                            marginRight: 5,
                          }}>
                          /
                        </Text>
                      ),
                      field?.title && (
                        <Text
                          style={{
                            fontSize: width > 400 ? 18 : 14,
                            fontWeight: 'bold',
                            paddingRight: 10,
                          }}>
                          {`${t(field.title)}:`}
                        </Text>
                      ),
                      <Text
                        style={{
                          fontSize: width > 400 ? 30 : 20,
                          fontWeight: 'bold',
                          paddingRight: 10,
                        }}>
                        {records[field.name]}
                      </Text>,
                    ])}
                  </View>
                  <Text
                    style={[
                      styles.pillbox,
                      { fontSize: width > 400 ? 18 : 14 },
                    ]}>
                    {t(form.unit)}
                  </Text>
                </View>
                {form.editable ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                    }}>
                    {form.fields.map((field, i) => [
                      i > 0 && !field?.title && (
                        <Text
                          style={{
                            fontSize: width > 400 ? 30 : 20,
                            fontWeight: 'bold',
                          }}>
                          /
                        </Text>
                      ),
                      field?.title && (
                        <Text
                          style={{
                            fontSize: width > 400 ? 18 : 14,
                            fontWeight: 'bold',
                            paddingRight: 10,
                          }}>
                          {`${t(field.title)}:`}
                        </Text>
                      ),
                      <>
                        <View
                          style={{
                            width: width > 400 ? 75 : 60,
                            borderBottomWidth: 4,
                            borderColor: 'grey',
                            marginRight: 0,
                          }}>
                          <TextInput
                            style={{
                              fontSize: width > 400 ? 22 : 18,
                              fontWeight: 'bold',
                              textAlign: 'center',
                              marginBottom: -10,
                            }}
                            keyboardType={'decimal-pad'}
                            maxLength={maxLength}
                            value={this.state[field.name]}
                            onChangeText={this.handleChangeValue(field.name)}
                          />
                        </View>
                      </>,
                    ])}
                    <Text
                      style={[
                        styles.pillbox,
                        { fontSize: width > 400 ? 18 : 14 },
                      ]}>
                      {t(form.unit)}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.rightPanel}>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.radius,
                      {
                        flex: 1,
                        backgroundColor: '#ff2014',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                    onPress={this.handleCancel}>
                    <Text
                      style={[
                        styles.btnText,
                        { fontSize: width > 400 ? 20 : 16 },
                      ]}>
                      {t('common:cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radius,
                      {
                        flex: 1,
                        backgroundColor: '#5B8899',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                    onPress={this.handleClear}>
                    <Text
                      style={[
                        styles.btnText,
                        { fontSize: width > 400 ? 20 : 16 },
                      ]}>
                      {t('common:clear')}
                    </Text>
                  </TouchableOpacity>
                  {form.editable ? (
                    <TouchableOpacity
                      style={[
                        styles.radius,
                        {
                          flex: 1,
                          backgroundColor: '#25a18d',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={this.handleSubmit}>
                      <Text
                        style={[
                          styles.btnText,
                          { fontSize: width > 400 ? 20 : 16 },
                        ]}>
                        {t('common:confirm')}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  leftPanel: {
    flex: 2,
    marginRight: 20,
    justifyContent: 'space-between',
  },
  rightPanel: {
    flex: 1,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.4,
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
  },
  inputPanel: {
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  radius: {
    borderRadius: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ff2014',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#25a18d',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#5B8899',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.4,
  },
});

const mapStateToProps = (state) => ({
  healthRecord: state.healthdata.record,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation(['healthForm', 'common'])(ModalDynamicView));
