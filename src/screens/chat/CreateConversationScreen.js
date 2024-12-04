import React, { PureComponent } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import Parse from 'parse/react-native';
import _ from 'lodash';
import { colors } from '../../styles';
import { MHW_HOST } from '../../utils/constants';

export default class CreateConversationScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // friendIds: [],
      text: '',
      itemActived: NaN,
      items: [],
      isLoadding: false,
      isError: false,
    };

    this._isMounted = false;
    this._isClickSubmit = false;

    // this.fetchFriendIds = this.fetchFriendIds.bind(this);
    this.filterUser = this.filterUser.bind(this);
    this._handleChangeText = this._handleChangeText.bind(this);
    this._handlePressItem = this._handlePressItem.bind(this);
    this._handleClickSubmit = this._handleClickSubmit.bind(this);

    this._handleChange = _.debounce(this.filterUser, 400);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (this._isClickSubmit && nextProps.conversation.isError) {
      this.setState({
        isError: nextProps.conversation.isError,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async filterUser() {
    // clean active item
    this.setState({
      isLoadding: true,
      itemActived: NaN,
    });

    try {
      const { text } = this.state;
      const { authentication } = this.props;
      let indexMatchesParameter = NaN;

      const UserDetail = Parse.Object.extend('UserDetail');
      const userDetailQuery = new Parse.Query(UserDetail);
      userDetailQuery.notEqualTo('userid', authentication.id);
      userDetailQuery.matches('user.username', `.*${text}.*`);
      userDetailQuery.limit(10);
      const userDetail = await userDetailQuery.find();
      const newUserDetail = userDetail.map((o, index) => {
        if (o.get('user').username === text) {
          indexMatchesParameter = index;
        }

        return {
          userid: o.get('userid'),
          user: o.get('user'),
        };
      });
      if (this._isMounted) {
        this.setState({
          isLoadding: false,
          items: newUserDetail,
          itemActived: indexMatchesParameter,
        });
      }
    } catch (error) {
      // TODO handle error
      // console.log(error);
      if (this._isMounted) {
        this.setState({ isLoadding: false });
      }
    }
  }

  _handleChangeText(value) {
    const val = value.trim();
    this.setState({ text: val });
  }

  _handlePressItem(item, index) {
    this.setState({
      text: item.user.username,
      itemActived: index,
    });
  }

  _handleClickSubmit() {
    this._isClickSubmit = true;
    const { itemActived, items } = this.state;
    const { addConversationFunction } = this.props;
    const payload = items[itemActived];
    addConversationFunction(payload);
  }

  render() {
    const { text, items, isLoadding, itemActived, isError } = this.state;
    const { conversation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {isError && conversation.error && (
          <View style={styles.messageError}>
            <Text style={styles.textError}>{conversation.error.message}</Text>
          </View>
        )}
        <View style={styles.inputGroup}>
          <View style={styles.inputLabel}>
            <Text style={styles.inputLabelText}>To: </Text>
          </View>
          <TextInput
            style={styles.input}
            value={text}
            onChange={this._handleChange}
            onChangeText={this._handleChangeText}
            placeholder="Type the username of a friend"
          />
        </View>
        <FlatList
          data={items}
          extraData={this.state}
          keyExtractor={(item) => item.userid}
          ListFooterComponent={
            isLoadding && <ActivityIndicator style={{ margin: 5 }} />
          }
          style={styles.list}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                !Number.isNaN(itemActived) && itemActived === index
                  ? styles.listItemActived
                  : {},
              ]}
              activeOpacity={0.6}
              onPress={() => this._handlePressItem(item, index)}>
              <View style={styles.listItemLeft}>
                <Image
                  style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                  source={{
                    uri: `${MHW_HOST}/files/avatar_120/${
                      item.user.avatar || 'default.png'
                    }`,
                  }}
                />
              </View>
              <View style={styles.listItemCenter}>
                <Text numberOfLines={1} style={styles.textTitleList}>
                  {item.user.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {!Number.isNaN(itemActived) && (
          <View
            style={{
              flex: 0.2,
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                height: 70,
                width: 70,
                borderRadius: 70 / 2,
                justifyContent: 'center',
                backgroundColor: '#f1f1f1',
              }}
              onPress={this._handleClickSubmit}>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

CreateConversationScreen.propTypes = {
  authentication: PropTypes.object.isRequired,
  addConversationFunction: PropTypes.func.isRequired,
  conversation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBg,
  },
  inputGroup: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  inputLabel: {
    width: 40,
    justifyContent: 'center',
  },
  inputLabelText: {
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    height: 70,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#F1F1F1',
  },
  listItemActived: {
    backgroundColor: '#f1f1f1',
  },
  listItemCenter: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'center',
  },
  listItemLeft: {
    padding: 10,
    width: 60,
    justifyContent: 'center',
  },
  textTitleList: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'rgba(0,0,0,0.8)',
  },
  messageError: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: colors.danger,
  },
  textError: {
    color: colors.textWhite,
  },
});
