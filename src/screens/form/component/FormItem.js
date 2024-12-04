import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { isEmpty } from 'lodash';
import { Col, Grid, Thumbnail } from 'native-base';

import { colors } from '../../../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NEW_COLOR } from '../../../utils/constants';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const UserBlock = (props) => {
  const { authentication, currentuser } = props;

  if (!isEmpty(currentuser)) {
    return (
      <View style={userBlockStyle.userBlock}>
        <Grid>
          <Col style={userBlockStyle.userBlockIcon}>
            <Thumbnail
              style={userBlockStyle.profileThumbnail}
              source={{
                uri: authentication.avatar,
              }}
            />
          </Col>
          <Col>
            <Text style={userBlockStyle.userRNameLine} numberOfLines={1}>
              {currentuser.firstname + ' ' + currentuser.surname}
            </Text>
            <Text style={userBlockStyle.userDNameLine} numberOfLines={1}>
              <Text style={styles.userDNameBoldLine}>ID Number : </Text>
              {currentuser.idcard}
            </Text>
            <Text style={userBlockStyle.userDNameLine} numberOfLines={1}>
              <Text style={userBlockStyle.userDNameBoldLine}>
                Device Name :
              </Text>
              {authentication?.username}
            </Text>
          </Col>
        </Grid>
      </View>
    );
  }
  return null;
};

export const StaffBlock = (props) => {
  const { staffDetail, onPress, style } = props;
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
  return (
    // <View style={staffBlockStyle.staffBlockPosition}>
    <View
      style={{
        position: 'absolute',
        top: 5,
        left: WidthMoreThenHeight ? 0 : width > 400 ? 0 : -50,
        zIndex: 1,
      }}>
      <TouchableOpacity onPress={onPress} style={staffBlockStyle.userBlock}>
        {staffDetail?.is_logged_in ? (
          <>
            <View style={staffBlockStyle.userBlockIcon}>
              <Thumbnail
                style={staffBlockStyle.profileThumbnail}
                source={{
                  uri:
                    'https://www.myhealthgroup.net/files/avatar_120/' +
                    staffDetail?.avatar,
                }}
              />
            </View>
            <View style={staffBlockStyle.userBlockText}>
              <Text style={staffBlockStyle.userRNameLine} numberOfLines={1}>
                Staff : {staffDetail.fullname_th}
              </Text>

              <Text style={staffBlockStyle.userDNameLine} numberOfLines={1}>
                <Text style={staffBlockStyle.userDNameBoldLine}>
                  ID Number :
                </Text>
                {staffDetail?.idcard}
              </Text>
              <Text style={staffBlockStyle.userDNameLine} numberOfLines={1}>
                <Text style={staffBlockStyle.userDNameBoldLine}>
                  User Name : 
                </Text>
                {staffDetail?.username}
              </Text>
            </View>
          </>
        ) : (
          <View style={staffBlockStyle.gridCenter}>
            <Text style={staffBlockStyle.textB30}>Staff Login</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
// return null;

export const CardBox = (props) => {
  const { text } = props;
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
  //datebox
  return (
    <View style={commonStyles.titleCardBox}>
      <Text
        style={[
          commonStyles.textTitle,
          { fontSize: WidthMoreThenHeight ? 20 : width > 400 ? 20 : 16 },
        ]}>
        {text}
      </Text>
    </View>
  );
};

export const LabelBox = (props) => {
  const { title } = props;
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
  return (
    <View style={styles.itemLabelBox}>
      {title?.title ? (
        <Text
          style={[
            commonStyles.textTitle,
            { color: title?.muted && colors?.textMuted,fontSize:WidthMoreThenHeight?20:width>400?20:18 },
          ]}>
          {title?.title}
        </Text>
      ) : null}
      {title?.subtitle ? (
        <Text style={[commonStyles.textSubTitle, { paddingLeft: 20 }]}>
          {title?.subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'green',
  },
  contentContainer: {
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  partListZone: {
    // backgroundColor: 'lightgrey',
  },
  partListScrollView: {
    paddingHorizontal: 10,
  },
  partListContainer: {
    paddingVertical: 10,
  },
  contentActionZone: {
    // backgroundColor: 'skyblue',
  },

  //---------------
  formBodyScrollViewContainer: {
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'column',
    borderRadius: 10,
  },
  formHeaderContainer: {
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  formBodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  //------
  formTitleContainer: {
    padding: 10,
  },

  //-----------------
  itemLabelBox: {
    padding: 10,
    marginTop: 10,
  },
  itemInputBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  itemRadioBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTimeBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInputListRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  //-------------
  itemInputListButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
});

const commonStyles = StyleSheet.create({
  titleCardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  cardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
});

const userBlockStyle = StyleSheet.create({
  userBlock: {
    height: 80,
    margin: 10,
    borderRadius: 35,
    padding: 10,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
    width: '25%',
    position: 'absolute',
    right: 20,
  },
  userBlockIcon: {
    width: 90,
    height: 60,
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
});

const staffBlockStyle = StyleSheet.create({
  staffBlockPosition: {
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 1,
  },
  userBlock: {
    borderRadius: 50,
    paddingVertical: 5,
    backgroundColor: NEW_COLOR['light_blue'],
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBlockIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  userBlockText: {
    justifyContent: 'center',
    paddingRight: 30,
  },
  profileThumbnail: {
    borderColor: 'white',
    borderWidth: 2,
  },
  userRNameLine: {
    fontSize: 18,
    fontFamily: 'LINESeedSansTH_A_Bd',
    color: NEW_COLOR['blue'],
  },
  userDNameLine: {
    fontSize: 12,
    color: NEW_COLOR['blue'],
  },
  userDNameBoldLine: {
    fontSize: 12,
    fontFamily: 'LINESeedSansTH_A_Rg',
    color: NEW_COLOR['blue'],
  },
  textB30: {
    fontFamily: 'LINESeedSansTH_A_Bd',
    fontSize: 25,
    color: NEW_COLOR['blue'],
  },
  gridCenter: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingRight: 30,
    // backgroundColor: 'red',
  },
});
