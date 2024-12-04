import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import i18n from '../i18n';
import {
  BLUETOOTH_CONFIG_ACCESS_PASSWORD,
  NEW_COLOR,
  TRANSLATE_BUTTON_IMAGES,
} from '../utils/constants';
import prompt from 'react-native-prompt-android';
import * as dbconfig from '../utils/dbconfig';
import { settingBtn } from '../assets/buttons/settings.png';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BarButton({
  t,
  navigation,
  availableDeviceTypes,
  config,
}) {
  const [isShow, setIsShow] = useState(false);

  const [dimensions, setDimensions] = useState({
    window: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
    },
    screen: screenDimensions,
  });
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });
  const WidthMoreThenHeight =
    dimensions.window.width > dimensions.window.height;
  const width = dimensions.window.width;
  const height = dimensions.window.height;

  const renderImageButton = (source, onPress, backgroundColor) => {
    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <TouchableOpacity
              style={[barBtn.funcBtn, { backgroundColor }]}
              onPress={onPress}>
              <Image style={barBtn.img} source={source} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              // style={[barBtn.funcBtn, { backgroundColor, }]}
              style={{
                backgroundColor,
                width: width > 400 ? 60 : 50,
                height: width > 400 ? 60 : 50,
                padding: width > 400 ? 10 : 10,
                borderRadius: 50,
                marginVertical: width > 400 ? 10 : 6,
                borderColor: 'white',
                borderWidth: 2,
              }}
              onPress={onPress}>
              <Image style={barBtn.img} source={source} />
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  // ปุ่มเฟือง
  const handleBluetoothSetting = () => {
    // const { navigation, availableDeviceTypes } = this.props;

    prompt(
      'Enter password for access setting.',
      null,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: (password) => {
            if (password === BLUETOOTH_CONFIG_ACCESS_PASSWORD) {
              // navigation.replace('BLE', {
              //   devices: availableDeviceTypes,
              // });
              navigation.navigate('BLE', {
                devices: availableDeviceTypes,
              });
            }
          },
        },
      ],
      {
        type: 'secure-text',
        cancelable: true,
        placeholder: 'password',
      },
    );
  };
  // ปุ่มเปลี่ยนภาษา
  const handleChangeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'th' : 'en');
  };
  // ปุ่ม nurse
  const handleNurseEmergency = (userid) => {
    // const { navigation, t } = this.props;
    Alert.alert(
      t('emergencyNurseHeader'),
      t('emergencyNurseContent'),
      [
        {
          text: t('common:no'),
          style: 'cancel',
        },
        {
          text: t('common:yes'),
          onPress: () => {
            if (userid?.length > 0) {
              navigation.navigate('VideoCall', {
                participants: { userid },
                callType: 'outgoing',
              });
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  //   เช็คว่าเปิดฟังก์ชั่นอะไรบ้าง
  const renderActionBtns = () => {
    // const { config, t } = this.props;
    const features = dbconfig.homeScreenActionButtons(config);
    return features.map((feature) => {
      if (feature.type === 'emergencyNurse') {
        return (
          <>
            {renderImageButton(
              TRANSLATE_BUTTON_IMAGES[t('buttons:nurse2')],
              () => handleNurseEmergency(feature.params.userid),
              NEW_COLOR['orange'],
            )}
          </>
        );
      }
      if (feature.type === 'mhl') {
        console.log('url', config?.features?.mhl);
        return (
          <>
            {renderImageButton(
              TRANSLATE_BUTTON_IMAGES[t('buttons:mhl')],
              () => 
              InAppBrowser.open(config?.features?.mhl),
              // () => Linking.openURL(config?.features?.mhl),
              // () =>
                // navigation.navigate('WebFullScreen', {
                //   url: config?.features?.mhl,
                // }),
              NEW_COLOR['white'],
            )}
          </>
        );
      }
      return null;
    });
  };

  return (
    <View style={barBtn.btnRowBg}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          width: WidthMoreThenHeight ? 70 : width > 400 ? 80 : 60,
          height: WidthMoreThenHeight ? 70 : width > 400 ? 80 : 60,
          borderRadius: 50,
          backgroundColor: NEW_COLOR['blue'],
          borderColor: 'white',
          borderWidth: 2,
        }}
        onPress={() => setIsShow(!isShow)}>
        <FontAwesome
          name="bars"
          style={barBtn.icon}
          size={WidthMoreThenHeight ? 35 : width > 400 ? 40 : 30}
        />
      </TouchableOpacity>
      {isShow && [
        renderImageButton(
          TRANSLATE_BUTTON_IMAGES[t('buttons:setting')],
          () => handleBluetoothSetting(),
          NEW_COLOR['purple'],
        ),
        renderImageButton(
          TRANSLATE_BUTTON_IMAGES[t('buttons:questions')],
          () => navigation.navigate('InstructionVideo'),
          NEW_COLOR['yellow'],
        ),
        renderImageButton(
          TRANSLATE_BUTTON_IMAGES[t('buttons:language')],
          () => handleChangeLanguage(),
          NEW_COLOR['blue'],
        ),
        renderImageButton(
          TRANSLATE_BUTTON_IMAGES[t('buttons:license2')],
          () => navigation.navigate('LicenseHome'),
          NEW_COLOR['green'],
        ),
        renderActionBtns(),
      ]}
    </View>
  );
}

// const { width: SCREEN_WIDTH, scale } = Dimensions.get('window');
const barBtn = StyleSheet.create({
  btnRowBg: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: NEW_COLOR['gray'],
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 99,
  },
  barBtn: {
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: NEW_COLOR['blue'],
    borderColor: 'white',
    borderWidth: 2,
  },
  icon: {
    alignSelf: 'center',
    color: 'black',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  funcBtn: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 50,
    marginVertical: 10,
    borderColor: 'white',
    borderWidth: 2,
  },
});
