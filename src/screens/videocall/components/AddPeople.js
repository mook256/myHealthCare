/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Thumbnail } from 'native-base';

import { MHW_HOST, MHW_API_KEY } from '../../../utils/constants';

const partnerIconURI = 'http://hospitan.capsuledna.com/files/usr_img/';
const docImageURI = 'http://hospitan.capsuledna.com/files/doctors_img/';

export default class AddPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partners: [],
      contacts: [],
      loadingContact: false,
      activeTab: '',
      searchString: '',

      refreshing: false,
    };
  }

  componentDidMount() {
    this.fetchAds();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.fetchAds();
    });
  };

  fetchAds = () => {
    const { authentication } = this.props;
    const url = `${MHW_HOST}/mobile/api/homeadscard_v3`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authentication.token,
        'X-Api-Key': MHW_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ partners: responseData }, () => {
          if (responseData.length) {
            this.setState({ activeTab: responseData[0].partnerid }, () => {
              this.fetchContact();
            });
          }
        });
      });
  };

  fetchContact = () => {
    const { authentication } = this.props;
    const { activeTab, searchString } = this.state;
    const baseUrl = `${MHW_HOST}/mobile/api/teleclinicuserlist?page=1&partnerid=${activeTab}`;
    let param = '';
    if (searchString) {
      param = `&v=${searchString}`;
    }
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

  renderContact() {
    const { contacts } = this.state;
    const { invite } = this.props;
    if (contacts.length) {
      return contacts.map((people) => (
        <View key={people.doctorid} style={peopleStyles.container}>
          <View style={peopleStyles.card}>
            <View style={peopleStyles.thumbnailContainer}>
              <Image
                style={peopleStyles.docThumbnail}
                source={{ uri: `${docImageURI}${people.avatar}` }}
              />
            </View>
            <View style={peopleStyles.detailBox}>
              <View style={peopleStyles.nameBox}>
                <Text style={peopleStyles.name}>{people.title}</Text>
                <Text numberOfLines={1} style={peopleStyles.content}>
                  {people.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => invite(people.doctorid)}>
                <View style={peopleStyles.inviteBtn}>
                  <Text style={peopleStyles.inviteText}>เพิ่ม</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ));
    }
    return (
      <View style={peopleStyles.noContactContainer}>
        <Text style={peopleStyles.noContactText}>ไม่มีรายการผู้ติดต่อ</Text>
      </View>
    );
  }

  toggleActiveTap = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({ activeTab: tab, loadingContact: true }, () => {
        this.fetchContact();
      });
    }
  };

  renderPartnerIconRow() {
    const { partners, activeTab } = this.state;
    let backgroundColor = 'powderblue';
    let borderColor = 'steelblue';

    return (
      <View style={partnerStyle.container}>
        <View style={partnerStyle.box}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={partnerStyle.horizontalView}>
            {partners &&
              partners.map((partner) => {
                if (partner.adsBgColor && partner.adsBorderColor) {
                  backgroundColor = partner.adsBgColor;
                  borderColor = partner.adsBorderColor;
                } else {
                  backgroundColor = 'powderblue';
                  borderColor = 'steelblue';
                }
                return (
                  <View key={partner.partnerid}>
                    <TouchableOpacity
                      onPress={() => this.toggleActiveTap(partner.partnerid)}>
                      <View
                        style={[
                          partnerStyle.iconContainer,
                          { borderColor: `${borderColor}` },
                        ]}>
                        <Thumbnail
                          style={
                            activeTab === partner.partnerid
                              ? [
                                  partnerStyle.activeIcon,
                                  { backgroundColor: `${backgroundColor}` },
                                ]
                              : [
                                  partnerStyle.inActiveIcon,
                                  { backgroundColor: `${backgroundColor}` },
                                ]
                          }
                          source={{ uri: `${partnerIconURI}${partner.icon}` }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    );
  }

  renderSearchbar() {
    const { searchString } = this.state;
    return (
      <View style={searchbarStyle.container}>
        <Searchbar
          style={searchbarStyle.searchbar}
          onChangeText={(text) =>
            this.setState({ searchString: text }, () => this.fetchContact())
          }
          value={searchString}
          // icon={() => null}
          iconColor="#777777"
          inputStyle={searchbarStyle.inputStyle}
          returnKeyType="search"
          onSubmitEditing={() => this.fetchContact()}
          placeholderTextColor="#777777"
          placeholder="Search..."
        />
      </View>
    );
  }

  renderGroupIsFull() {
    return (
      <View style={mainStyles.container}>
        <View style={mainStyles.boxContainer}>
          <View style={mainStyles.header}>
            <Text style={mainStyles.headerText}>Invite</Text>
          </View>
          <View style={mainStyles.groupIsFulContainer}>
            <Text numberOfLines={1} style={mainStyles.groupIsFullText}>
              Group is full
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { loadingContact, refreshing } = this.state;
    const { peerIds } = this.props;
    if (peerIds.length === 3) {
      return this.renderGroupIsFull();
    }
    return (
      <View style={mainStyles.container}>
        <View style={mainStyles.boxContainer}>
          <View style={mainStyles.header}>
            <Text style={mainStyles.headerText}>Invite</Text>
          </View>
          <ScrollView
            scrollEventThrottle={30}
            refreshControl={
              <RefreshControl
                colors={['#fff']}
                tintColor="#fff"
                refreshing={refreshing}
                onRefresh={() => this._onRefresh()}
              />
            }>
            {this.renderSearchbar()}
            {this.renderPartnerIconRow()}
            {loadingContact ? (
              <ActivityIndicator
                style={{ marginTop: 30 }}
                animating
                color="#fff"
              />
            ) : (
              <>
                {this.testUser()}
                {this.renderContact()}
              </>
            )}

            <View style={{ flex: 1, height: 350 }} />
          </ScrollView>
        </View>
      </View>
    );
  }

  testUser() {
    const { invite } = this.props;
    return (
      <>
        <View style={peopleStyles.container}>
          <View style={peopleStyles.card}>
            <View style={peopleStyles.thumbnailContainer}>
              <Image
                style={peopleStyles.docThumbnail}
                source={{
                  uri:
                    'https://scontent.fhdy3-1.fna.fbcdn.net/v/t1.0-9/73395291_691478744706134_1760097745592385536_n.png?_nc_cat=109&_nc_sid=85a577&_nc_ohc=ngpg_8XixfwAX9al34R&_nc_ht=scontent.fhdy3-1.fna&oh=32c9051d88152551db921031336a087e&oe=5F4005CD',
                }}
              />
            </View>
            <View style={peopleStyles.detailBox}>
              <View style={peopleStyles.nameBox}>
                <Text style={peopleStyles.name}>Test Teleclinic</Text>
                <Text numberOfLines={1} style={peopleStyles.content}>
                  Test Video Call Group
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => invite('36a704aaa6c18b75404c3e0e135c6f1c')}>
                <View style={peopleStyles.inviteBtn}>
                  <Text style={peopleStyles.inviteText}>เพิ่ม</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={peopleStyles.container}>
          <View style={peopleStyles.card}>
            <View style={peopleStyles.thumbnailContainer}>
              <Image
                style={peopleStyles.docThumbnail}
                source={{
                  uri:
                    'https://scontent.fhdy3-1.fna.fbcdn.net/v/t1.0-9/52605923_496037707593514_5092413629035184128_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeFBwKI361xEw4AP6JznGKkLYsxS7wI2vIJizFLvAja8grT7HA214NfdxZP-u17ccSngv4kuhJ8QvMJat-I523ky&_nc_ohc=2S7tUMwROtsAX_oZF1P&_nc_ht=scontent.fhdy3-1.fna&oh=a4964360ef81f55684863b7f273820b7&oe=5F3FF652',
                }}
              />
            </View>
            <View style={peopleStyles.detailBox}>
              <View style={peopleStyles.nameBox}>
                <Text style={peopleStyles.name}>Test Teleclinic 2</Text>
                <Text numberOfLines={1} style={peopleStyles.content}>
                  Test Video Call Group
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => invite('ebdf820583054f02dc2623892d5c435f')}>
                <View style={peopleStyles.inviteBtn}>
                  <Text style={peopleStyles.inviteText}>เพิ่ม</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#222222',
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255,255,255,0.5)'
    // backgroundColor: 'yellow',
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255,255,255,0.5)'
    // backgroundColor: 'yellow',
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  // iconContainer: {
  //   width: 35,
  //   height: 35,
  //   backgroundColor: '#4fc3f7',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 50,
  // },
  // icon: {
  //   color: '#ffffff',
  // },
  headerText: {
    fontSize: 18,
    marginTop: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
  groupIsFulContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  groupIsFullText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
    marginTop: 50,
  },
});

const partnerStyle = StyleSheet.create({
  container: {
    marginTop: 5,
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  box: {
    flex: 3,
  },
  horizontalView: {
    alignItems: 'center',
    paddingStart: 5,
    paddingEnd: 5,
  },
  iconContainer: {
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150 / 2,
    borderWidth: 2,
  },
  activeIcon: {
    borderWidth: 2,
    borderColor: '#e5efef',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  inActiveIcon: {
    borderWidth: 2,
    borderColor: '#e5efef',
    opacity: 0.9,
    width: 55,
    height: 55,
    borderRadius: 28,
  },
});

const searchbarStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  searchbar: {
    borderRadius: 10,
    height: '80%',
    elevation: 0,
    marginHorizontal: 15,
    backgroundColor: '#4C4C4C',
  },
  inputStyle: {
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.0)',
    color: '#fff',
    marginLeft: -15,
  },
});

const peopleStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 20,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
  },
  thumbnailContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  docThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  detailBox: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#4C4C4C',
    paddingBottom: 10,
  },
  nameBox: {
    marginHorizontal: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'NotoSansThaiUI-SemiBold',
  },
  content: {
    fontSize: 14,
    color: '#777777',
    fontFamily: 'NotoSansThaiUI-Regular',
  },
  inviteBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#4C4C4C',
    height: 30,
    borderRadius: 15,
    marginTop: 8,
  },
  inviteText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'NotoSansThaiUI-Bold',
  },
  noContactContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  noContactText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'NotoSansThaiUI-Regular',
  },
});

// AddPeople.propTypes = {
//   authentication: PropTypes.any.isRequired,
//   peerIds: PropTypes.any.isRequired,
//   invite: PropTypes.any.isRequired,
// };
