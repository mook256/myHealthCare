import React, { PureComponent } from 'react';
import {
  AppState,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

const messageLimit = 30;

// TODO show error
export default class MessangeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingEarlier: false,
      appState: AppState.currentState,
    };
    this.n = 1;
    this._isMounted = false;

    this._onSend = this._onSend.bind(this);
    this._onLoadEarlier = this._onLoadEarlier.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    const { navigation, fetchMessagesFunction } = this.props;
    const id = navigation.getParam('objectId');
    fetchMessagesFunction(id);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    const { isLoading, isLoadingEarlier } = this.state;
    if (isLoading && !message.padding) {
      // delay render chat component
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ isLoading: false });
        }
      }, 2000);
    }

    if (isLoadingEarlier && !message.padding) {
      if (this._isMounted) {
        this.setState({ isLoadingEarlier: false });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    const { conversationMessageClearFunction } = this.props;
    conversationMessageClearFunction();
  }

  _onSend(messages = []) {
    const { navigation, addMessageFunction } = this.props;
    const conversationId = navigation.getParam('objectId');
    addMessageFunction(conversationId, messages[0]);
  }

  _onLoadEarlier() {
    this.setState({ isLoadingEarlier: true });

    this.n += 1;

    const { navigation, fetchMessagesFunction } = this.props;
    const id = navigation.getParam('objectId');
    fetchMessagesFunction(id, this.n);
  }

  handleAppStateChange(nextAppState) {
    const { navigation, fetchMessagesFunction } = this.props;
    const id = navigation.getParam('objectId');
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      fetchMessagesFunction(id);
    }
    this.setState({ appState: nextAppState });
  }

  selectPhotoTapped() {
    const { navigation, addMessageFunction } = this.props;
    const conversationId = navigation.getParam('objectId');

    ImagePicker.showImagePicker(
      {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          // TODO handle error
          return;
        }

        addMessageFunction(conversationId, {
          image: {
            name: response.fileName || response.uri.split('/').pop(),
            type: response.type,
            uri: Platform.select({
              android: response.uri,
              ios: response.uri.replace('file://', ''),
            }),
          },
        });
      },
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            // fontSize: 18,
          },
          left: {
            color: 'rgba(0,0,0,0.6)',
            // fontSize: 18,
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: '#4fc3f7',
          },
          left: {
            backgroundColor: '#eceff1',
          },
        }}
      />
    );
  }

  renderCustomActions() {
    return (
      <View style={styles.customActionsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.selectPhotoTapped}>
          <Ionicons name="md-attach" size={23} color="#808080" />
        </TouchableOpacity>

        {/* <TouchableOpacity
        onPress={() => {}}
      >
        <View style={styles.buttonContainer}>
          <Ionicons name="ios-happy" size={23} color="#808080" />
        </View>
      </TouchableOpacity> */}
      </View>
    );
  }

  render() {
    const { message, authentication, navigation } = this.props;
    const { isLoadingEarlier, isLoading } = this.state;

    if (!message.conversationId.trim().length) {
      return (
        <View style={styles.spinner}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <GiftedChat
          messages={message.items}
          loadEarlier={
            isLoadingEarlier ||
            (!isLoading && message.items.length >= messageLimit * this.n)
          }
          isLoadingEarlier={isLoadingEarlier}
          onLoadEarlier={this._onLoadEarlier}
          onSend={this._onSend}
          onLongPress={() => {}}
          user={{
            _id: authentication.id,
            name: authentication.username,
          }}
          parsePatterns={(linkStyle) => [
            {
              pattern: /(https?:\/\/[^\s]+)/g,
              style: linkStyle,
              onPress: (url) => {
                navigation.navigate('Web', { url });
              },
            },
          ]}
          renderBubble={this.renderBubble}
          renderActions={this.renderCustomActions}
          extraData={this.state}
          keyboardShouldPersistTaps="never"
          scrollToBottom
          inverted
          locale="th"
        />
      </SafeAreaView>
    );
  }
}

MessangeScreen.propTypes = {
  authentication: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  fetchMessagesFunction: PropTypes.func.isRequired,
  addMessageFunction: PropTypes.func.isRequired,
  conversationMessageClearFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 10,
  },
  customActionsContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingLeft: 10,
  },
});
