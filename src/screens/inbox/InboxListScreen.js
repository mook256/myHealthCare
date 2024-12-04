import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { colors } from '../../styles';
import { InboxItem } from '../../components/InboxItem';
import ErrorRequest from '../../components/ErrorRequest';
import EmptyContent from '../../components/EmptyContent';

export default class InboxListScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      isError: false,
    };

    this.onReload = this.onReload.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { notification } = nextProps;
    const { isLoading, isRefreshing } = this.state;
    if (isLoading && !notification.pending) {
      this.setState({
        isLoading: false,
        isError: notification.isError,
      });
    }

    if (isRefreshing && !notification.pending) {
      this.setState({
        isRefreshing: false,
        isError: notification.isError,
      });
    }
  }

  onReload() {
    this.setState({ isLoading: true });

    const { fetchNotificationFunction } = this.props;
    fetchNotificationFunction();
  }

  onRefresh() {
    this.setState({ isRefreshing: true });

    const { fetchNotificationFunction } = this.props;
    fetchNotificationFunction();
  }

  _renderListEmpty() {
    return (
      <EmptyContent
        source={require('../../assets/images/backgroud-empty-inbox.png')}
        body={{
          title: 'ยังไม่มีการแจ้งเตือน',
          descriptions:
            'การแจ้งเตือนทั้งหมดที่เราส่งจะปรากฏที่นี่, เพื่อให้คุณสามารถดูได้อย่างง่ายดายทุกที่ทุกเวลา',
        }}
        hiddenBtn
      />
    );
  }

  render() {
    const {
      notification,
      authentication,
      isNetWorkConnected,
      navigation,
    } = this.props;
    const { isLoading, isRefreshing, isError } = this.state;
    if (isLoading && !isError) {
      return <View style={styles.spinner}>{/* <ActivityIndicator /> */}</View>;
    }

    if (
      (!isNetWorkConnected && !notification.items.length) ||
      (isError && !notification.items.length)
    ) {
      return <ErrorRequest onPress={this.onReload} />;
    }

    return (
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={this._renderListEmpty()}
        style={styles.container}
        data={notification.items}
        renderItem={({ item }) => (
          <InboxItem
            authentication={authentication}
            navigation={navigation}
            date={moment(item.createdAt).fromNow()}
            {...item}
          />
        )}
        keyExtractor={(item) => item.objectId}
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
        removeClippedSubviews={false}
        initialNumToRender={10}
        extraData={notification.items}
      />
    );
  }
}

InboxListScreen.propTypes = {
  notification: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  fetchNotificationFunction: PropTypes.func.isRequired,
  isNetWorkConnected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBg,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
