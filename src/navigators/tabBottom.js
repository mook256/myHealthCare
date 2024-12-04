/* @flow */
/* eslint-disable */
import React from 'react';
import {Platform, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreenContainer from '../screens/home/HomeScreenContainer';
import {colors} from '../styles';
import calendarIcon from '../assets/icons/calendar.png';
import calendarDefaultIcon from '../assets/icons/calendar-default.png';
import meIcon from '../assets/icons/me.png';
import meDefaultIcon from '../assets/icons/me-default.png';
import saleIcon from '../assets/icons/sale.png';
import saleDefaultIcon from '../assets/icons/sale-default.png';
import moreDefaultIcon from '../assets/icons/more-default.png';
// import ProfileScreenContainer from '../screens/profile/ProfileScreenContainer';
// import StoreScreenContainer from '../screens/store/StoreScreenContainer';
import InboxListScreenContainer from '../screens/inbox/InboxListScreenContainer';
import ConversationScreenContainer from '../screens/chat/ConversationScreenContainer';
import InboxIconBadge from '../screens/shared/InboxIconBadgeContainer';

type Props = {
  focused: String,
};

const InboxNavigator = createStackNavigator(
  {
    Conversation: {
      screen: ConversationScreenContainer,
      navigationOptions: ({navigation}) => ({
        title: 'Inbox',
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <InboxIconBadge mode="top" />
          </TouchableOpacity>
        ),
      }),
    },
    Notification: {
      screen: InboxListScreenContainer,
      navigationOptions: ({navigation}) => ({
        title: 'Notification',
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Conversation')}>
            <Icon
              name="ios-chatbubbles"
              style={{marginRight: 13, color: '#90a4ae'}}
              size={24}
            />
          </TouchableOpacity>
        ),
      }),
    },
  },
  {
    initialRouteName: 'Conversation',
    defaultNavigationOptions: {
      ...Platform.select({
        android: {
          headerStyle: {
            backgroundColor: colors.navigationHeaderBg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            elevation: 0,
          },
        },
      }),
    },
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreenContainer,
      navigationOptions: {
        tabBarLabel: 'วันนี้',
        tabBarIcon: ({focused}: Props) => (
          <Image
            style={{width: 24, height: 24}}
            source={focused ? calendarIcon : calendarDefaultIcon}
          />
        ),
      },
    },
    // Profile: {
    //   screen: ProfileScreenContainer,
    //   navigationOptions: {
    //     tabBarLabel: 'คุณ',
    //     tabBarIcon: ({ focused }: Props) => (
    //       <Image style={{ width: 24, height: 24 }} source={focused ? meIcon : meDefaultIcon} />
    //     ),
    //   },
    // },
    // Timeline: {
    //   screen: MenuScreenContainer,
    //   navigationOptions: {
    //     tabBarLabel: 'เพื่อน',
    //     tabBarIcon: ({ focused }: Props) => (
    //       <View
    //         style={{
    //           width: 70,
    //           height: 70,
    //           borderRadius: 35,
    //           backgroundColor: '#4fc3f7',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <Image
    //           style={{ width: 24, height: 24 }}
    //           source={focused ? moreDefaultIcon : moreDefaultIcon}
    //         />
    //       </View>
    //     ),
    //   },
    // },
    // Store: {
    //   screen: StoreScreenContainer,
    //   navigationOptions: {
    //     tabBarLabel: 'สโตร์',
    //     tabBarIcon: ({ focused }: Props) => (
    //       <Image style={{ width: 24, height: 24 }} source={focused ? saleIcon : saleDefaultIcon} />
    //     ),
    //   },
    // },
    Inbox: {
      screen: InboxNavigator,
      navigationOptions: {
        tabBarLabel: 'อินบ็อกซ์',
        tabBarIcon: ({focused}: Props) => (
          <InboxIconBadge focused={focused} mode="bottom" />
        ),
      },
    },
    // More: {
    //   screen: FriendScreenContainer,
    //   navigationOptions: {
    //     tabBarLabel: 'เมนู',
    //     tabBarIcon: ({ focused }: Props) => (
    //       <Image style={{ width: 24, height: 24 }}
    // source={focused ? moreIcon : moreDefaultIcon} />
    //     ),
    //   },
    // },
  },
  {
    tabBarOptions: {
      activeTintColor: colors.textPrimary,
      inactiveTintColor: 'gray',
      showLabel: false,
      tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
      },
      labelStyle: {
        fontFamily: 'NotoSansThaiUI-Regular',
        fontSize: 10,
      },
      style: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#FFFFFF',
      },
    },
  },
);

// TabNavigator.navigationOptions = ({ navigation }) => {
//   if (navigation.state.index === 4) {
//     const headerOptions = {
//       title: 'Inbox',
//     };
//     if (
//       Object.hasOwnProperty.call(navigation.state.routes[4], 'index')
//       && navigation.state.routes[4].index === 0
//     ) {
//       headerOptions.headerRight = () => (
//         <View style={styles.btnGroupNavigation}>
//           <TouchableOpacity
//             style={styles.btnNavigation}
//             onPress={() => navigation.navigate('CreateConversation')}
//           >
//             <Text style={styles.btnTextNavigation}>เพิ่ม</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }
//
//     return headerOptions;
//   }
//
//   return { header: null };
// };

// TabNavigator.navigationOptions = ({ navigation }) =>
//   if (navigation.state.index === 4) {
//     const headerOptions = {
//       title: 'Inbox',
//     };
//     return headerOptions;
//   }
//   ({ header: null })
// ;

TabNavigator.navigationOptions = ({navigation}) => ({headerShown: false});

// const styles = StyleSheet.create({
//   btnGroupNavigation: {
//     flex: 1,
//     flexDirection: 'row',
//     margin: 5,
//   },
//   btnNavigation: {
//     marginRight: 17,
//   },
//   btnTextNavigation: {
//     color: '#707070',
//     margin: 0,
//   },
// });

export default TabNavigator;
