/* eslint-disable */
import React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from 'react-navigation-stack';
import WebScreenContainer from '../screens/web/WebScreenContainer';
import { colors } from '../styles';
import MainScreenContainer from '../screens/main/MainScreenContainer';
import PreteleScreenContainer from '../screens/teleclinic/PreteleScreenContainer';
import TeleSelDocScreenContainer from '../screens/teleclinic/TeleSelDocScreenContainer';
import MessangeScreenContainer from '../screens/chat/MessangeScreenContainer';
import CreateConversationScreenContainer from '../screens/chat/CreateConversationScreenContainer';
import VideoCallScreenContainer from '../screens/videocall/VideoCallScreenContainer';
import IncomingVideoCallScreenContainer from '../screens/videocall/IncomingVideoCallScreenContainer';
import TeleProcessWebScreenContainer from '../screens/teleProcess/WebScreenContainer';
import HomeScreenContainer from '../screens/home/HomeScreenContainer';
import CardIdLoginScreenContainer from '../screens/login/CardIdLoginScreenContainer';
import UserLoginScreenContainer from '../screens/login/UserLoginScreenContainer';
import StaffLoginScreenContainer from '../screens/login/StaffLoginScreenContainer';
import InboxListScreenContainer from '../screens/inbox/InboxListScreenContainer';
import ConversationScreenContainer from '../screens/chat/ConversationScreenContainer';
import SuccessScreenContainer from '../screens/teleclinic/SuccessScreenContainer';
import HealthLogScreenContainer from '../screens/healthLog/HealthLogScreenContainer';
import CameraScreenContainer from '../screens/camera/CameraScreenContainer';
import InstructionVideoScreenContainer from '../screens/instuctionVideo/InstructionVideoScreenContainer';
import LicenseScreenContainer from '../screens/license/LicenseScreenContainer';
import AppConfigScreenContainer from '../screens/appConfig/AppConfigScreenContainer';
import BLEConfigScreenContainer from '../screens/appConfig/BLEConfigScreenContainer';
import SelectCovidFormScreenContainer from '../screens/covid/SelectCovidFormScreenContainer';
import AddHealthFormScreenContainer from '../screens/covid/AddHealthFormScreenContainer';
import AddMentalHealthFormScreenContainer from '../screens/covid/AddMentalHealthFormScreenContainer';
import TeleClinicBookingScreenContainer from '../screens/teleclinicBooking/TeleClinicBookingScreenContainer';
import TeleClinicBookingWebScreenContainer from '../screens/teleclinicBooking/TeleClinicBookingWebScreenContainer';
import AnalyticScreenContainer from '../screens/analytic/AnalyticScreenContainer';
import LicenseHomeScreenContainer from '../screens/license/LicenseHomeScreenContainer';
import CameraUploadWebScreenContainer from '../screens/cameraupload/WebScreenContainer';
import AdlFormScreenContainer from '../screens/form/adl/AdlFormScreenContainer';
import ElderHealthCheckUpScreenContainer from '../screens/form/eldHmain/ElderHealthCheckUpScreenContainer';
import CareGiverScreenContainer from '../screens/form/careGiver/CareGiverScreenContainer';
import MhlScreen from '../screens/mhl/MhlScreen';
import EsasScreenContainer from '../screens/form/esas/EsasScreenContainer';
import FaceScreenContainer from '../screens/form/face/FaceScreenContainer';
import PpsScreenContainer from '../screens/form/pps/PpsScreenContainer';
import PosScreenContainer from '../screens/form/pos/PosScreenContainer';

const LoginStack = createStackNavigator(
  {
    Home: HomeScreenContainer,
    CardIdLogin: CardIdLoginScreenContainer,
    UserLogin: UserLoginScreenContainer,
    StaffLogin: StaffLoginScreenContainer,
    Camera: CameraScreenContainer,
    License: LicenseScreenContainer,
    //temporary
    BLE: BLEConfigScreenContainer,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const AppMainStack = createStackNavigator(
  {
    Web: {
      screen: WebScreenContainer,
      navigationOptions: ({ navigation }) => {
        if (navigation.state.params.isCloseIcon === false) {
          return {
            headerShown: false,
          };
        } else if (navigation.state.params.isCloseIcon === true) {
          return {
            title: navigation.state.params.title,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10, color: '#90a4ae' }}
                onPress={() => navigation.popToTop()}>
                <Text>Close</Text>
              </TouchableOpacity>
            ),
          };
        }
        return {
          title: navigation.state.params.title,
          headerShown: false,
        };
      },
    },
    WebFullScreen: {
      screen: WebScreenContainer,
      navigationOptions: ({ navigation }) => {
        if (navigation.state.params.isCloseIcon) {
          return {
            title: navigation.state.params.title,
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10, color: '#90a4ae' }}
                onPress={() => navigation.popToTop()}>
                <Text>Close</Text>
              </TouchableOpacity>
            ),
          };
        }
        return {
          title: navigation.state.params.title,
          headerShown: false,
        };
      },
    },
    TeleProcess: {
      screen: TeleProcessWebScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CameraUpload: {
      screen: CameraUploadWebScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CreateConversation: {
      screen: CreateConversationScreenContainer,
      navigationOptions: {
        title: 'สร้างการสนทนาใหม่',
      },
    },
    Conversation: {
      screen: ConversationScreenContainer,
      navigationOptions: ({ navigation }) => ({
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
      navigationOptions: ({ navigation }) => ({
        title: 'Notification',
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Conversation')}>
            <Icon
              name="ios-chatbubbles"
              style={{ marginRight: 13, color: '#90a4ae' }}
              size={24}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Message: {
      screen: MessangeScreenContainer,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('participants').user.username,
        headerStyle: { height: 70 },
        headerRight: () => (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              backgroundColor: '#4169e1',
            }}
            onPress={() =>
              navigation.navigate('VideoCall', {
                channelName: navigation.getParam('objectId'),
                participants: navigation.getParam('participants'),
                callUUID: 'f0798b0f-8c07-49a8-afe0-40af6436a7c1',
                callType: 'outgoing',
              })
            }>
            <Icon
              name="video"
              style={{ flex: 1, marginRight: 10, color: '#fff' }}
              size={24}
            />
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Video Call
            </Text>
          </TouchableOpacity>
        ),
      }),
    },
    MainScreen: {
      screen: MainScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    Pretele: {
      screen: PreteleScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    TeleSelDocScreen: {
      screen: TeleSelDocScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    TeleSuccess: {
      screen: SuccessScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CovidSelectForm: {
      screen: SelectCovidFormScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CovidHealthForm: {
      screen: AddHealthFormScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CovidMentalHealthForm: {
      screen: AddMentalHealthFormScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    AdlScreen: {
      screen: AdlFormScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    EldHMainScreen: {
      screen: ElderHealthCheckUpScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    CareGiverScreen: {
      screen: CareGiverScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    EsasScreen: {
      screen: EsasScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    FaceScreen: {
      screen: FaceScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    PpsScreen: {
      screen: PpsScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    PosScreen: {
      screen: PosScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    HealthLog: {
      screen: HealthLogScreenContainer,
      navigationOptions: {
        title: 'เปลี่ยนแปลงค่าข้อมูล',
      },
    },
    AppConfig: {
      screen: AppConfigScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    BLEConfig: {
      screen: BLEConfigScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    TeleClinicBooking: {
      screen: TeleClinicBookingScreenContainer,
      navigationOptions: {
        headerShown: false,
      },
    },
    TeleClinicBookingWeb: {
      screen: TeleClinicBookingWebScreenContainer,
      navigationOptions: {
        title: 'จองวิดีโอคอลแพทย์',
      },
    },
    AnalyticScreen: {
      screen: AnalyticScreenContainer,
      navigationOptions: {
        title: 'วิเคราะห์ผลสุขภาพ',
      },
    },
  },
  {
    initialRouteName: 'MainScreen',
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

const AppStack = createStackNavigator(
  {
    Main: AppMainStack,
    Login: LoginStack,
    IncomingVideoCall: IncomingVideoCallScreenContainer,
    VideoCall: VideoCallScreenContainer,
    InstructionVideo: InstructionVideoScreenContainer,
    LicenseHome: LicenseHomeScreenContainer,
    Mhl: MhlScreen,
  },
  {
    initialRouteName: 'Login',
    mode: 'modal',
    headerMode: 'none',
  },
);

export default AppStack;
