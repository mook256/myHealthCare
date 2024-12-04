import React, { PureComponent } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
import { MHW_HOST } from '../../utils/constants';
import { colors } from '../../styles';
import ErrorRequest from '../../components/ErrorRequest';
import EmptyContent from '../../components/EmptyContent';

const urlImage = `${MHW_HOST}/files/avatar_120/`;

const colorUserStatus = {
  online: colors.online,
  offline: colors.offline,
};

function getColorUserStatus(userStatusObject = {}) {
  if (_.isEmpty(userStatusObject) || !Object.keys(userStatusObject).length) {
    return colorUserStatus.offline;
  }

  return colorUserStatus[userStatusObject.status];
}

export default class ConversationScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      isError: null,
    };

    this._itemActive = undefined;
    this.onReload = this.onReload.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPressActionButton = this.onPressActionButton.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  // componentDidMount() {
  //   const { fetchConversationFunction } = this.props;
  //   this.props.navigation.addListener('didFocus', () => {
  //     fetchConversationFunction();
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    const { conversation } = nextProps;
    const { isLoading, isRefreshing } = this.state;

    // turn off spinner load
    if (isLoading && !conversation.pending) {
      this.setState({
        isLoading: false,
        isError: conversation.isError,
      });
    }

    // turn off spinner refresh
    if (isRefreshing && !conversation.pending) {
      this.setState({
        isRefreshing: false,
        isError: conversation.isError,
      });
    }
  }

  onReload() {
    // turn on spinner
    this.setState({ isLoading: true });

    const { fetchConversationFunction } = this.props;
    fetchConversationFunction();
  }

  onRefresh() {
    // turn on spinner
    this.setState({ isRefreshing: true });

    const { fetchConversationFunction } = this.props;
    fetchConversationFunction();
  }

  onPressActionButton(index) {
    const { deleteConversationFunction } = this.props;
    if (index === 0) {
      deleteConversationFunction(this._itemActive.objectId);
    }

    this._itemActive = undefined;
  }

  showActionSheet(item) {
    this._itemActive = item;
    this._actionSheet.show();
  }

  _renderListEmpty() {
    return (
      <EmptyContent
        body={{
          title: 'ยังไม่มีรายการสนทนา',
          descriptions:
            'ดูเหมือนว่าไม่มีข้อความในกล่องจดหมายของคุณ "ให้เริ่มส่งข้อความทันที"!',
        }}
        textBtn="เริ่มการสนทนา"
        hiddenBtn
      />
    );
  }

  _messageText(object) {
    if (!_.isEmpty(object.image)) {
      return 'รูปภาพ';
    }

    return object.text || '';
  }

  render() {
    const { navigation, conversation, isNetWorkConnected } = this.props;
    const { isLoading, isRefreshing, isError } = this.state;
    if (isLoading && !isError) {
      return (
        <View style={styles.spinner}>
          <ActivityIndicator />
        </View>
      );
    }

    if (
      (!isNetWorkConnected && !conversation.items.length) ||
      (isError && !conversation.items.length)
    ) {
      return <ErrorRequest onPress={this.onReload} />;
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.listGroup}
          contentContainerStyle={{ flexGrow: 1 }}
          data={conversation.items}
          onEndReachedThreshold={0.01}
          extraData={conversation}
          refreshing={isRefreshing}
          onRefresh={this.onRefresh}
          ListEmptyComponent={this._renderListEmpty()}
          renderItem={({ item: { participants, message, ...o } }) => (
            <View style={styles.list}>
              <TouchableOpacity
                style={styles.listBtnMore}
                onPress={() => this.showActionSheet({ ...o })}>
                <Icon name="more-horizontal" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listCard}
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('Message', {
                    ...o,
                    participants,
                  })
                }>
                <View style={styles.listImage}>
                  <View
                    style={[
                      styles.userStatus,
                      {
                        backgroundColor: getColorUserStatus(
                          participants.userStatus,
                        ),
                      },
                    ]}
                  />
                  <Image
                    style={styles.avatar}
                    source={{
                      uri: `${
                        urlImage + participants.user.avatar || 'default.png'
                      }`,
                    }}
                  />
                </View>
                <View style={styles.listBody}>
                  <Text numberOfLines={1} style={styles.listTextTitle}>
                    {participants.user.username}
                  </Text>
                  {typeof message !== 'undefined' && (
                    <Text numberOfLines={1} style={styles.listTextDescription}>
                      {`${this._messageText(message)} . ${moment(
                        message.createdAt,
                      ).fromNow()}`}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.objectId}
        />
        <ActionSheet
          ref={(o) => {
            this._actionSheet = o;
          }}
          options={['Delete', 'cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.onPressActionButton}
        />
      </View>
    );
  }
}

ConversationScreen.propTypes = {
  conversation: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        objectId: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
        participants: PropTypes.object.isRequired,
        message: PropTypes.object,
      }),
    ).isRequired,
  }).isRequired,
  isNetWorkConnected: PropTypes.bool.isRequired,
  fetchConversationFunction: PropTypes.func.isRequired,
  deleteConversationFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listGroup: {
    flex: 1,
    marginTop: 5,
  },
  list: {
    height: 70,
  },
  listBtnMore: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 28,
    width: 28,
    alignSelf: 'flex-end',
    zIndex: 100,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCard: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F1F1',
  },
  listImage: {
    padding: 10,
    width: 60,
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  userStatus: {
    marginBottom: -8,
    zIndex: 2,
    width: 13,
    height: 13,
    backgroundColor: '#000',
    borderWidth: 1,
    borderRadius: 13 / 2,
    borderColor: colors.white,
  },
  listBody: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'center',
  },
  listTextTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'rgba(0,0,0,0.8)',
  },
  listTextDescription: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.3)',
  },
});
