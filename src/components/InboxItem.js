/* eslint-disable global-require */
import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Thumbnail } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MHW_HOST, MHW_API_KEY } from '../utils/constants';

export class InboxItem extends Component {
  constructor(props) {
    super(props);

    this.state = { show: true };

    this.confirmTag = this.confirmTag.bind(this);
    this.confirmFriend = this.confirmFriend.bind(this);
    this.redirect = this.redirect.bind(this);
    this.renderFriendReq = this.renderFriendReq.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderTagReq = this.renderTagReq.bind(this);
  }

  confirmTag(reqidx) {
    const { authentication } = this.props;
    const formData = new FormData();
    formData.append('reqid', reqidx);
    fetch(`${MHW_HOST}/mobile/api/tagconfirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authentication.token,
        'X-API-KEY': MHW_API_KEY,
      },
      body: formData,
    }).then(() => {
      this.setState({ show: false });
    });
  }

  confirmFriend(reqidx) {
    const { authentication } = this.props;
    const formData = new FormData();
    formData.append('postid', reqidx);
    fetch(`${MHW_HOST}/mobile/api/friendconfirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authentication.token,
        'X-API-KEY': MHW_API_KEY,
      },
      body: formData,
    }).then(() => {
      this.setState({ show: false });
    });
  }

  redirect() {
    const { navigation, postopt, type } = this.props;
    switch (type) {
      case 'HealthSuggest': {
        navigation.navigate('AppStackHome', {
          itemId: 86,
          otherParam: 'anything you want here',
        });
        return;
      }
      case 'VisitAdd': {
        navigation.navigate('Home', {
          itemId: 86,
          otherParam: 'anything you want here',
        });
        return;
      }
      case 'HealthReportAdd': {
        navigation.navigate('LabResult', { reportId: postopt.reportid });
        return;
      }
      case 'PostComment': {
        const { opt } = postopt;
        navigation.navigate('PostComment', { id: opt.postid });
        return;
      }
      case 'Point': {
        navigation.navigate('Store', {
          itemId: 86,
          otherParam: 'anything you want here',
        });
        return;
      }
      case 'Deal': {
        navigation.navigate('Store');
        // eslint-disable-next-line no-useless-return
        return;
      }
      default: {
        // somting
      }
    }
  }

  renderFriendReq() {
    const { show } = this.state;
    const { postopt, body, date, postid } = this.props;
    if (show) {
      return (
        <View style={styles.content}>
          <Grid>
            <Col style={{ width: 55, marginLeft: 10, marginRight: 10, marginTop: 5 }}>
              <Thumbnail medium source={{ uri: postopt.reqavatar }} />
            </Col>
            <Col style={styles.oneColumn}>
              <Text style={styles.typeHeader}>คำร้องขอเป็นเพื่อน</Text>
              <Text numberOfLines={2} style={styles.typeContent}>
                {body}
              </Text>
              <Text style={styles.typeContentDate}>{date}</Text>
            </Col>
            <Col style={{ width: 40, marginLeft: 10, marginRight: 10, marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => {
                  this.confirmFriend(postid);
                }}
              >
                <View style={styles.btnCircle}>
                  <Ionicons name="ios-checkmark" style={{ fontSize: 40, color: '#88bd4b' }} />
                </View>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      );
    }
    return (
      <View style={styles.content}>
        <Text style={styles.successText}>เพิ่มเพื่อนแล้ว</Text>
      </View>
    );
  }

  renderItem() {
    const { type, body, date } = this.props;
    let textHeader = '';
    let avatarImg = require('../assets/images/doctor.png');
    if (type === 'HealthSuggest') {
      textHeader = 'คำแนะนำสุขภาพของคุณ';
      avatarImg = require('../assets/images/doctor.png');
    } else if (type === 'otp') {
      textHeader = 'มีการร้องของ OTP';
      avatarImg = require('../assets/images/key2.png');
    } else if (type === 'VisitAdd') {
      textHeader = 'คิวโรงพยาบาล';
      avatarImg = require('../assets/images/tickets.png');
    } else if (type === 'HealthReportAdd') {
      textHeader = 'ผลตรวจสุขภาพ';
      avatarImg = require('../assets/images/prescription.png');
    } else if (type === 'PostComment') {
      textHeader = 'ความเห็นเพื่อนๆ';
      avatarImg = require('../assets/images/chat.png');
    } else if (type === 'Point') {
      textHeader = 'คุณได้รับ mCoin';
      avatarImg = require('../assets/images/Coins-icon.png');
    } else if (type === 'Deal') {
      textHeader = 'ดีลเด่นๆ เพื่อคุณ';
      avatarImg = require('../assets/images/Coins-icon.png');
    } else {
      textHeader = 'อื่นๆ';
      avatarImg = require('../assets/images/doctor.png');
    }

    return (
      <View style={styles.content}>
        <Grid>
          <Col style={{ width: 55, marginLeft: 10, marginRight: 10, marginTop: 5 }}>
            <Thumbnail medium source={avatarImg} />
          </Col>
          <Col style={styles.oneColumn}>
            <TouchableOpacity onPress={this.redirect}>
              <Text style={styles.typeHeader}>{textHeader}</Text>
              <Text numberOfLines={2} style={styles.typeContent}>
                {body}
              </Text>
              <Text style={styles.typeContentDate}>{date}</Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      </View>
    );
  }

  renderTagReq() {
    const { show } = this.state;
    const { postopt, body, date } = this.props;
    if (show) {
      return (
        <View style={styles.content}>
          <Grid>
            <Col style={{ width: 55, marginLeft: 10, marginRight: 10, marginTop: 5 }}>
              <Thumbnail medium source={{ uri: postopt.reqavatar }} />
            </Col>
            <Col style={styles.oneColumn}>
              <Text style={styles.typeHeader}>คำร้องเข้าร่วมกลุ่ม</Text>
              <Text numberOfLines={2} style={styles.typeContent}>
                {body}
              </Text>
              <Text style={styles.typeContentDate}>{date}</Text>
            </Col>
            <Col style={{ width: 40, marginLeft: 10, marginRight: 10, marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => {
                  this.confirmTag(postopt.reqid);
                }}
              >
                <View style={styles.btnCircle}>
                  <Ionicons name="ios-checkmark" style={{ fontSize: 40, color: '#88bd4b' }} />
                </View>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      );
    }
    return (
      <View style={styles.content}>
        <Text style={styles.successText}>เข้ากลุ่มแล้ว</Text>
      </View>
    );
  }

  render() {
    const { type } = this.props;
    if (type === 'friendreq') {
      return this.renderFriendReq();
    }
    if (type === 'tagreq') {
      return this.renderTagReq();
    }
    return this.renderItem();
  }
}

InboxItem.defaultProps = {
  postid: '',
  postopt: {},
};

InboxItem.propTypes = {
  authentication: PropTypes.shape({ token: PropTypes.string }).isRequired,
  postopt: PropTypes.shape({
    opt: PropTypes.object,
    reportid: PropTypes.string,
    reqavatar: PropTypes.string,
    reqid: PropTypes.string,
  }),
  type: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  postid: PropTypes.string,
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingTop: 10,
    paddingBottom: 10,
    height: 90,
  },
  typeHeader: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  typeContent: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  typeContentDate: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.2)',
  },
  oneColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 0,
    marginRight: 10,
  },
  btnCircle: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'NotoSansThaiUI-Regular',
    fontWeight: '500',
    color: 'rgba(0,0,0,0.3)',
  },
});
