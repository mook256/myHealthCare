/* eslint-disable */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import TopNav from '../../components/TopNav';
import { MHW_HOST_OLD, MHW_API_KEY, DOCTOR_IMAGE_URL, DOCTOR_BOOKING_URL, MHW_HOST } from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');


class TeleSelDocScreen extends Component {
  _interval = undefined;

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      loadingContact: false,
      refreshing: false,
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
    this.fetchDoctor();
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
  }
  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  };
  async _goToMessage(participant) {
    const { goToMessageFunction } = this.props;
    goToMessageFunction(participant);
  }

  fetchDoctor = () => {
    const { authentication, config } = this.props;
    const baseUrl = `${MHW_HOST}/mobile/api/teleclinicdoctorlist?page=1&partnerid=${config?.partner?.partnerid}&type=mhc`;
    let param = '';
    const url = baseUrl + param;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authentication.token,
        'X-Api-Key': MHW_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          contacts: responseData,
          loadingContact: false,
          refreshing: false,
        });
      });
  };

  renderItem(item, index) {
    const { navigation, authentication } = this.props;
    // onPress={() => navigation.navigate('VideoCall', {
    //   channelName: 'generateDaiLoei',
    //   participants: 'askPlugForFurthurInformation',
    //   callUUID: 'f0798b0f-8c07-49a8-afe0-40af6436a7c1',
    //   callType: 'outgoing',
    // })}
    return (
      <View style={docStyle.userBlock} key={`${index}touch`}>
        <Grid>
          <Col style={docStyle.userBlockIcon}>
            <Thumbnail
              style={docStyle.profileThumbnail}
              source={{
                uri: `${DOCTOR_IMAGE_URL}/${item.avatar}`,
              }}
            />
          </Col>
          <Col>
            <Text style={docStyle.userRNameLine} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={docStyle.userDNameLine} numberOfLines={1}>
              {item.content}
            </Text>
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <TouchableOpacity
                style={docStyle.callBtn}
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('TeleClinicBookingWeb', {
                    url: `${DOCTOR_BOOKING_URL}/${item.doctorid}`,
                    isHeaders: true,
                  })
                }>
                <FontAwesome
                  name="sticky-note"
                  style={{ alignSelf: 'center' }}
                  size={25}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </Col>
        </Grid>
      </View>
    );
  }

  renderImage(url) {
    return (
      <View style={webBlk.container}>
        <Image
          source={{ uri: url }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  }

  render() {
    const {
      navigation,
      user,
      authentication,
      currentuser,
      t,
    } = this.props;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    // const dataList = [{ id: 1, title: "Item One"}, { id: 2, title: "Item Two"}, { id: 3, title: "Item Three"}, { id: 4, title: "Item Four"}, { id: 5, title: "Item Five"},{ id: 21, title: "Item One"}, { id: 22, title: "Item Two"}, { id: 23, title: "Item Three"}, { id: 24, title: "Item Four"}, { id: 25, title: "Item Five"},{ id: 31, title: "Item One"}, { id: 32, title: "Item Two"}, { id: 33, title: "Item Three"}, { id: 34, title: "Item Four"}, { id: 35, title: "Item Five"}];
    // const dataList = [{ id: 1, title: "Item One"}, { id: 2, title: "Item Two"}, { id: 3, title: "Item Three"}, { id: 4, title: "Item Four"}, { id: 5, title: "Item Five"}];
    const dataList = this.state.contacts;
    return (
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={
            <BackButton onPress={() => navigation.navigate('MainScreen')} />
          }
        />
        {/* {this.renderImage(config?.images?.[t('images:telePage')])} */}
        <Text style={styles.textHeader}>{t("teleBookingScreen:header")}</Text>
        <View style={{ marginLeft: 2, marginRight: 10, marginBottom: 290 }}>
          <FlatList
            data={dataList}
            style={{ flexDirection: 'column' }}
            numColumns={3}
            renderItem={({ item, index }) => this.renderItem(item, index)}
          />

          {/* <View style={docStyle.userBlock}>
            <Grid>
              <Col style={docStyle.userBlockIcon}>
                <Thumbnail
                  style={docStyle.profileThumbnail}
                />
              </Col>
              <Col>
                <Text style={docStyle.userRNameLine} numberOfLines={1}>
                  Doctortest
                </Text>
                <Text style={docStyle.userDNameLine} numberOfLines={1}>
                  Doctortest
                </Text>
                <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <TouchableOpacity
                    style={docStyle.callBtn}
                    activeOpacity={0.6}
                    onPress={() =>
                      this._goToMessage({
                        userid: 'useraf9c1d4daf1d4346062d9b62fb9144c5',
                        user: {
                          username: 'Doctortest',
                          avatar: '',
                        },
                      })
                    }>
                    <FontAwesome
                      name="video-camera"
                      style={{ alignSelf: 'center' }}
                      size={25}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              </Col>
            </Grid>
          </View> */}
        </View>
      </View>
    );
  }
}

const WIDTH = Dimensions.get('window').width;
const BLK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffe7d1'
    backgroundColor: '#000000',
  },
  textHeader: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
  }
});

const webBlk = StyleSheet.create({
  container: {
    // width: WIDTH-20,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    height: 160,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
});
const docBlk = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  box: {
    width: WIDTH / 3 - 10,
    justifyContent: 'center',
    // height: 60,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
});
const buttonBlk = StyleSheet.create({
  nextButton: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#00c853',
  },
  nextButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
const docStyle = StyleSheet.create({
  userBlock: {
    width: WIDTH / 3 - 16,
    justifyContent: 'center',
    height: 160,
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  userBlockIcon: {
    width: 155,
    height: 150,
  },
  profileThumbnail: {
    width: 140,
    height: 140,
    borderRadius: 15,
  },
  userRNameLine: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474f',
  },
  userDNameLine: {
    fontSize: 12,
    color: '#546e7a',
  },
  userDNameBoldLine: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#546e7a',
  },
  callBtn: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00c853',
  },
});

TeleSelDocScreen.propTypes = {
  authentication: PropTypes.shape({
    avatar: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  user: PropTypes.object.isRequired,
  userLookupFunction: PropTypes.func.isRequired,
  notification: PropTypes.any.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const mapStatetoProps = ({ currentuser }) => {
  return { currentuser };
};

export default connect(mapStatetoProps)(TeleSelDocScreen);
