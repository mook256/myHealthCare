import { string } from 'prop-types';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import component from 'react-native-draggable-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { NEW_COLOR } from '../../utils/constants';
import { color } from 'react-native-reanimated';
import i18n from '../../i18n';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ComponentDataBox({
  // color,
  img,
  title,
  isEdit,
  dataCurrent,
  data,
  unit,
}) {
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
  const d3 = data?.[Object.keys(data)?.[0]]?.[0];
  const d2 = data?.[Object.keys(data)?.[0]]?.[1];
  const d1 = data?.[Object.keys(data)?.[0]]?.[2];
  const WidthMoreThenHeight =
    dimensions.window.width > dimensions.window.height;
  const width = dimensions.window.width;
  const height = dimensions.window.height;
  return (
    <>
      <View>
        {WidthMoreThenHeight ? (
          <View>
            <View style={styles.flexRow}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: height * 0.07,
                  width: height * 0.07,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  elevation: 5,
                }}>
                <Image
                  style={{ height: width * 0.025, width: width * 0.025 }}
                  source={img}
                />
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling={false}
                style={{
                  fontSize: width * 0.0145,
                  paddingLeft: width * 0.016,
                  paddingRight: width * 0.005,
                  color: '#717171',
                  fontFamily: 'LINESeedSansTH_A_Bd',
                }}>
                {title}
              </Text>
              <View style={styles.editBtn}>
                {isEdit ? (
                  <FontAwesome name={'pen'} size={16} color="#717171" />
                ) : null}
              </View>
            </View>
            <View style={{ paddingLeft: width * 0.0575 }}>
              <Text
                style={[
                  styles.textUnit,
                  { fontSize: width * 0.01, lineHeight: height * 0.025 },
                ]}>
                {unit}
              </Text>
            </View>
            <View style={{ height: height * 0.075, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: width * 0.045,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  lineHeight: height * 0.12,
                  color: 'black',
                  fontFamily: 'LINESeedSansTH_A_Bd',
                }}
                numberOfLines={1}
                // adjustsFontSizeToFit
              >
                {dataCurrent ? dataCurrent : '--'}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View
              style={[
                styles.flexRow,
                { paddingHorizontal: width > 400 ? 20 : 10 },
              ]}>
              <View
                style={[
                  styles.imgCover,
                  styles.shadow,
                  {
                    height: width > 400 ? 70 : 50,
                    width: width > 400 ? 70 : 50,
                  },
                ]}>
                <Image
                  style={{
                    height: width > 400 ? 40 : 30,
                    width: width > 400 ? 40 : 30,
                  }}
                  source={img}
                />
              </View>
              <View
                style={[
                  styles.titleWrapper,
                  {
                    paddingHorizontal: 0,
                  },
                ]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    allowFontScaling={false}
                    style={[
                      styles.textTitle,
                      { fontSize: width > 400 ? 20 : 14 },
                    ]}>
                    {title}
                  </Text>
                  <View style={styles.editBtn}>
                    {isEdit ? (
                      <FontAwesome
                        name={'pen'}
                        size={width > 400 ? 16 : 14}
                        color="#717171"
                      />
                    ) : null}
                  </View>
                </View>
                <View>
                  <View
                    style={[
                      styles.textDataVerticalProsition,
                      {
                        width: width > 400 ? width * 0.48 : width * 0.43,
                      },
                    ]}>
                    <View
                    // style={styles.textDataCurrentHeight}
                    >
                      <Text
                        style={[
                          styles.textDataCurrentVertical,
                          { fontSize: width > 400 ? 25 : 18 },
                        ]}
                        numberOfLines={1}
                        // adjustsFontSizeToFit
                      >
                        {dataCurrent ? dataCurrent : '--'}
                      </Text>
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                      <Text
                        style={[
                          styles.textUnit,
                          { fontSize: width > 400 ? 14 : 12 },
                        ]}>
                        {unit}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        {WidthMoreThenHeight ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: height * 0.075,
                  width: width * 0.0575,
                  borderRadius: width * 0.015,
                  marginTop: height * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    backgroundColor: NEW_COLOR['gray'],
                    paddingHorizontal: 6,
                    borderRadius: 50,
                    color: 'black',
                    fontSize: width * 0.01,
                  }}>
                  1
                </Text>
                <Text
                  style={{
                    fontFamily: 'LINESeedSansTH_A_Rg',
                    fontSize: width * 0.014,
                    fontWeight: '700',
                    color: '#2ecc71',
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {d3 ? (
                    <Text>
                      {typeof d3 === 'string' ? d3.replace(/"/gi, '') : d3}
                    </Text>
                  ) : (
                    '--'
                  )}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: height * 0.075,
                  width: width * 0.0575,
                  borderRadius: width * 0.015,
                  marginTop: height * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    backgroundColor: NEW_COLOR['gray'],
                    paddingHorizontal: 6,
                    borderRadius: 50,
                    color: 'black',
                    fontSize: width * 0.01,
                  }}>
                  2
                </Text>
                <Text
                  style={{
                    fontFamily: 'LINESeedSansTH_A_Rg',
                    fontSize: width * 0.014,
                    fontWeight: '700',
                    color: '#2ecc71',
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {d2 ? (
                    <Text>
                      {typeof d2 === 'string' ? d2.replace(/"/gi, '') : d2}
                    </Text>
                  ) : (
                    '--'
                  )}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: height * 0.075,
                  width: width * 0.0575,
                  borderRadius: width * 0.015,
                  marginTop: height * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    backgroundColor: NEW_COLOR['gray'],
                    paddingHorizontal: 6,
                    borderRadius: 50,
                    color: 'black',
                    fontSize: width * 0.01,
                  }}>
                  3
                </Text>
                <Text
                  style={{
                    fontFamily: 'LINESeedSansTH_A_Rg',
                    fontSize: width * 0.014,
                    fontWeight: '700',
                    color: '#dc3545',
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {d1 ? (
                    <Text>
                      {typeof d1 === 'string' ? d1.replace(/"/gi, '') : d1}
                    </Text>
                  ) : (
                    '--'
                  )}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    // flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    // margin: 5,
  },
  imgCover: {
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 50,

    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    elevation: 5,
  },
  img: {
    height: 30,
    width: 30,
  },
  iconEdit: {
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    // height: '90%',
    // justifyContent: 'center',
  },
  flexRowData: {
    flex: 0.4,
    backgroundColor: 'white',
    borderRadius: 30,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flexRowText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 10,
    color: '#717171',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  textData: {
    fontFamily: 'LINESeedSansTH_A_Rg',
    fontSize: 20,
    fontWeight: '700',
    color: '#2ecc71',
  },
  textUnit: {
    fontFamily: 'LINESeedSansTH_A_Rg',
    fontSize: 18,
    fontWeight: '800',
    color: '#717171',
  },
  textDataCurrent: {
    fontSize: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 85,
    color: 'black',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  Datatext: {
    backgroundColor: '#fff',
    height: 60,
    width: 80,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  textDataCurrentHeight: {
    height: 60,
    alignItems: 'center',
  },
  textPosition: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 200,
    padding: 10,
  },
  textDataVerticalProsition: {
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#707070',
    padding: 5,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDataCurrentVertical: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
});
