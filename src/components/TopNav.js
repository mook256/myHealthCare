/* eslint-disable */
/* eslint-disable global-require */
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import { Thumbnail } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { clearCurrentUser } from '../redux/actions/currentuser';
import store from '../redux/stores';
import { NEW_COLOR } from '../utils/constants';
import RNRestart from 'react-native-restart';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
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
  renderTopAds() {
    return (
      <View>
        <View style={styles.topAdsBlk}></View>
      </View>
    );
  }
  renderUserBlock() {
    const { user, authentication, currentuser, deviceName } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    if (!isEmpty(currentuser)) {
      return (
        <>
          {WidthMoreThenHeight ? (
            <>
              <View style={styles.userBlock}>
                <Grid>
                  <Col style={styles.userBlockIcon}>
                    <Thumbnail
                      style={styles.profileThumbnail}
                      source={{
                        uri: authentication.avatar,
                      }}
                    />
                  </Col>
                  <Col style={styles.userBlockText}>
                    <Text style={styles.userRNameLine} numberOfLines={1}>
                      {currentuser.firstname + ' ' + currentuser.surname}
                    </Text>
                    <Text style={styles.userDNameLine} numberOfLines={1}>
                      <Text style={styles.userDNameBoldLine}>ID Number : </Text>
                      {currentuser.idcard}
                    </Text>
                    <Text style={styles.userDNameLine} numberOfLines={1}>
                      <Text style={styles.userDNameBoldLine}>
                        Device Name :
                      </Text>
                      {deviceName}
                    </Text>
                  </Col>
                </Grid>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  height: width > 400 ? 80 : 60,
                  width: width * 0.6,
                  margin: 15,
                  borderRadius: 50,
                  paddingVertical: width > 400 ? 10 : 0,
                  paddingRight: 20,
                  backgroundColor: '#FFFFFF',
                }}>
                <View>
                  <View
                    style={{
                      width: 90,
                      height: 60,
                      padding: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Thumbnail
                        style={{
                          width: width > 400 ? 60 : 40,
                          height: width > 400 ? 60 : 40,
                          borderRadius: 30,
                        }}
                        source={{
                          uri: authentication.avatar,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        paddingHorizontal: 10,
                        width: width * 0.45,
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: width > 400 ? 18 : 14,
                          color: '#37474f',
                          fontFamily: 'LINESeedSansTH_A_Bd',
                        }}
                        numberOfLines={1}>
                        {currentuser.firstname + ' ' + currentuser.surname}
                      </Text>
                      <Text
                        style={[
                          styles.userDNameLine,
                          { fontSize: width > 400 ? 12 : 10 },
                        ]}
                        numberOfLines={1}>
                        <Text
                          style={[
                            styles.userDNameBoldLine,
                            { fontSize: width > 400 ? 12 : 10 },
                          ]}>
                          ID Number :
                        </Text>
                        {currentuser.idcard}
                      </Text>
                      <Text
                        style={[
                          styles.userDNameLine,
                          { fontSize: width > 400 ? 12 : 10 },
                        ]}
                        numberOfLines={1}>
                        <Text
                          style={[
                            styles.userDNameBoldLine,
                            { fontSize: width > 400 ? 12 : 10 },
                          ]}>
                          Device Name :
                        </Text>
                        {deviceName}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      );
    }
    return null;
  }

  render() {
    const { t, leftComponent } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <View style={styles.container}>
        <Grid>
          <Col
            style={{
              width: WidthMoreThenHeight ? width * 0.45 : width * 0.2,
              height: 100,
            }}>
            {leftComponent}
          </Col>
          <Col>{this.renderTopAds()}</Col>
          <Col style={{ width: width > 400 ? 285 : 230, height: 100 }}>
            {this.renderUserBlock()}
          </Col>
          <View style={styles.userRightIcon}>
            {WidthMoreThenHeight ? (
              <>
                <TouchableOpacity
                  style={styles.logoutBlk}
                  onPress={() => {
                    RNRestart.Restart();
                    store.dispatch(clearCurrentUser());
                  }}>
                  <Image
                    source={require('../assets/images/new-ui/unlock.png')}
                    style={styles.img}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View>
                  <TouchableOpacity
                    style={{
                      marginTop: 15,
                      marginRight: 40,
                      width: width > 400 ? 50 : 40,
                      height: width > 400 ? 50 : 40,
                      borderRadius: 35,
                      backgroundColor: NEW_COLOR['red'],
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      RNRestart.Restart();
                      store.dispatch(clearCurrentUser());
                    }}>
                    <Image
                      source={require('../assets/images/new-ui/unlock.png')}
                      style={{
                        width: width > 400 ? 25 : 20,
                        height: width > 400 ? 25 : 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Grid>
      </View>
    );
  }
}

TopNav.propTypes = {
  authentication: PropTypes.shape({
    avatar: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  user: PropTypes.object.isRequired,
  leftComponent: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    height: 105,
  },
  backBtnBlk: {
    width: SCREEN_WIDTH * 0.45,
    height: 100,
  },
  userDataBlk: {
    width: 350,
    height: 100,
  },
  userBlock: {
    height: 70,
    width: 285,
    margin: 15,
    borderRadius: 50,
    paddingVertical: 5,
    paddingRight: 20,
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
  },
  userBlockIcon: {
    width: 90,
    height: 60,
    alignItems: 'center',
  },
  userBlockText: {
    justifyContent: 'center',
  },
  userRightIcon: {
    width: 120,
    height: 60,
  },
  profileThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rightBtnBlk: {
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  logoutBlk: {
    marginTop: 15,
    marginLeft: 40,
    marginRight: 40,
    height: 60,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: NEW_COLOR['red'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRNameLine: {
    fontSize: 18,
    color: '#37474f',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  userDNameLine: {
    fontSize: 12,
    color: '#546e7a',
    fontFamily: 'LINESeedSansTH_A_Rg',
  },
  userDNameBoldLine: {
    fontSize: 12,
    color: '#546e7a',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  topAdsBlk: {
    height: 80,
    margin: 10,
    borderRadius: 10,
    // backgroundColor: '#eceff1'
  },
  img: {
    width: 40,
    height: 40,
  },
});

export default withTranslation('common')(TopNav);
