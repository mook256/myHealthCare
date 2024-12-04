import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Input, List, ListItem, Picker, Row } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../../../styles';
import DateInput from './DatePicker';
import { LabelBox } from './FormItem';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import component from 'react-native-draggable-view';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const renderItemText = (props) => {
  const { item } = props;
  return (
    <>
      <LabelBox title={item?.title} />
    </>
  );
};

export const renderItemInput = (props) => {
  const { item } = props;
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
    <>
      {item?.title ? <LabelBox title={item?.title} /> : null}
      <View style={item?.style?.wrapper}>
        {item?.input?.map((element) => (
          <React.Fragment key={element?.properties}>
            <View style={[styles.itemInputBox, element?.option?.style,{paddingHorizontal: WidthMoreThenHeight? 10:5}]}>
              {element?.option?.label ? (
                <Text
                  style={{
                    paddingHorizontal: WidthMoreThenHeight
                      ? 20
                      : width > 400
                      ? 20
                      : 5,
                    fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 14,
                  }}>
                  {element?.option?.label}
                </Text>
              ) : null}
              <Input
                placeholder={element?.option?.placeholder}
                keyboardType={element?.option?.keyboardType}
                maxLength={element?.option?.maxLength}
                onChangeText={(newValue) =>
                  props.setState({
                    properties: element?.properties,
                    value: newValue,
                  })
                }
                value={props.state?.[element?.properties]?.value}
                style={[
                  styles.itemInput,
                  {
                    fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 16 : 12,
                  },
                ]}
                disabled={element?.disabled}
              />
              {element?.option?.unit ? (
                <Text
                  style={{
                    paddingHorizontal:  WidthMoreThenHeight ? 20 : width > 400 ? 20: 10,
                    fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 14,
                  }}>
                  {element?.option?.unit}
                </Text>
              ) : null}
            </View>
          </React.Fragment>
        ))}
      </View>
    </>
  );
};

export const renderItemRadio = (props) => {
  const { item, state } = props;
  const propertiesVal = state?.[item?.input?.properties]?.value;
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
    <>
      <LabelBox title={item?.title} />
      <RadioButton.Group
        onValueChange={(newValue) => {
          props.setState({
            properties: item?.input?.properties,
            value: propertiesVal === newValue ? null : newValue,
          });
        }}
        value={props.state?.[item?.input?.properties]?.value}
        style={{}}>
        {item?.input?.choice?.map((element) => (
          <React.Fragment key={element?.properties}>
            <TouchableOpacity
              style={styles.itemRadioBox}
              onPress={() =>
                props.setState({
                  properties: item?.input?.properties,
                  value:
                    propertiesVal === element?.label ? null : element?.label,
                })
              }>
              <RadioButton value={element?.label} />
              <Text style={commonStyles.textSubTitle}>{element?.label}</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </RadioButton.Group>
    </>
  );
};

export const renderItemCheckBox = (props) => {
  const { item, state } = props;

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

  let itemList = state?.[item?.input?.properties]?.value || [];

  const addCheckBoxItem = (value) => {
    if (!(itemList?.indexOf(value) >= 0)) {
      props.setState({
        properties: item?.input?.properties,
        value: itemList.concat(value),
      });
    }
  };

  const removeCheckBoxItem = (value) => {
    const index = itemList?.indexOf(value);
    props.setState({
      properties: item?.input?.properties,
      value: itemList.filter((item, i) => i !== index),
    });
  };

  return (
    <>
      <LabelBox title={item?.title} />
      <View style={item?.style?.wrapper}>
        {item?.input?.choice?.map((element) => (
          <React.Fragment key={element?.properties}>
            <TouchableOpacity
              style={[styles.itemRadioBox, { marginVertical: 5 }]}
              onPress={() => {
                itemList?.indexOf(element?.label) >= 0
                  ? removeCheckBoxItem(element?.label)
                  : addCheckBoxItem(element?.label);
              }}>
              <CheckBox
                value={itemList?.indexOf(element?.label) >= 0}
                onValueChange={() => {
                  itemList?.indexOf(element?.label) >= 0
                    ? removeCheckBoxItem(element?.label)
                    : addCheckBoxItem(element?.label);
                }}
                style={styles.checkbox}
              />
              <Text
                style={[
                  commonStyles.textSubTitle,
                  {
                    fontSize: WidthMoreThenHeight ? 16 : width > 400 ? 16 : 14,
                  },
                ]}>
                {element?.label}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </>
  );
};

export const renderTimePicker = (props) => {
  const { item } = props;

  return (
    <>
      <LabelBox title={item?.title} />
      <View style={styles.itemTimeBox}>
        <DateInput
          value={
            props?.state?.[item?.properties]?.value || moment().add(543, 'year')
          }
          onChange={(newValue) =>
            props.setState({
              properties: item?.properties,
              value: newValue,
            })
          }
        />
      </View>
    </>
  );
};

export const renderItemInputList = (props) => {
  const { item, state } = props;

  let itemList = state?.[item?.input?.properties]?.value || [];

  const addItem = () => {
    if (state?.temp?.value) {
      props.setState({
        properties: item?.input?.properties,
        value: itemList.concat(state?.temp?.value),
      });
      props.setState({
        properties: 'temp',
        value: '',
      });
    }
  };

  const removeItem = (index) => {
    props.setState({
      properties: item?.input?.properties,
      value: itemList.filter((item, i) => i !== index),
    });
  };

  return (
    <>
      <LabelBox title={item?.title} />
      <Row style={styles.itemInputListRow}>
        <View style={[styles.itemInputBox, { width: '80%' }]}>
          <Input
            placeholder={item?.title?.title}
            onChangeText={(newValue) => {
              props.setState({
                properties: 'temp',
                value: newValue,
              });
            }}
            value={state?.temp?.value}
          />
        </View>
        <TouchableOpacity
          onPress={() => addItem()}
          style={styles.itemInputListButton}>
          <Text style={commonStyles.textTitle}>เพิ่ม</Text>
        </TouchableOpacity>
      </Row>
      <List
        style={{
          width: '90%',
          alignSelf: 'center',
        }}>
        {itemList?.map((item, i) => (
          <ListItem key={i} style={{ justifyContent: 'space-between' }}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(i)}>
              <FontAwesome name="times" size={25} />
            </TouchableOpacity>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export const renderItemSelectWithIcon = (props) => {
  const { item, state } = props;
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
    <>
      <LabelBox title={item?.title} />
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {item?.input?.choice?.map((element) => (
          <React.Fragment key={element?.properties}>
            <TouchableOpacity
              style={styles.itemSelectWithIconBox}
              onPress={() =>
                props.setState({
                  properties: item?.input?.properties,
                  value: element?.value,
                })
              }>
              <FontAwesome
                name={element?.icon}
                style={{ alignSelf: 'center' }}
                size={WidthMoreThenHeight ? 90 : width > 400 ? 70 : 50}
                color={
                  state?.[item?.input?.properties]?.value === element.value
                    ? element?.color ?? 'red'
                    : // : element?.color + '99' ?? 'lightgrey'
                      'lightgrey'
                }
              />
              <Text style={commonStyles.textTitle}>{element?.value}</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </>
  );
};
export const renderItemPicker = (props) => {
  const { item, state } = props;
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
  const onPickItem = (value) => {
    props.setState({
      properties: item?.input?.properties,
      value: value,
    });
  };
  const renderInputBox = (properties) => {
    return (
      <>
        <TextInput
          style={styles.textInput}
          placeholder="ระบุ"
          onChangeText={(value) =>
            props.setState({
              properties: properties + '_input',
              value: value,
            })
          }
          value={state[properties + '_input']?.value}
        />
      </>
    );
  };

  let showInput =
    state[item?.input?.properties]?.value === 'อื่น ๆ ระบุ' ||
    state[item?.input?.properties]?.value === 'มะเร็ง';

  return (
    <>
      {item?.title ? <LabelBox title={item?.title} /> : null}
      <View
        style={[
          item?.style?.wrapper,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <View style={[styles.itemInputBox, item?.input?.style]}>
          {item?.input?.label ? (
            <Text
              style={{
                paddingHorizontal: WidthMoreThenHeight
                  ? 20
                  : width > 400
                  ? 20
                  : 10,
                fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 14,
                // width: showInput ? '40%' : '100%',
              }}>
              {item?.input?.label}
            </Text>
          ) : null}
          <Picker
            mode="dropdown"
            selectedValue={state[item?.input?.properties]?.value}
            onValueChange={onPickItem.bind(this)}>
            {item?.input?.choice?.map((element, i) => (
              <Picker.Item
                key={element?.label}
                label={(item?.No ? i + 1 + '. ' : '') + element?.label}
                value={element?.label}
              />
            ))}
          </Picker>
          {showInput ? renderInputBox(item?.input?.properties) : null}
        </View>
      </View>
    </>
  );
};

export const RenderItem = (props) => {
  const { item, state, prevState } = props;

  if (state?.[item?.show]) {
    return true;
  }

  if (item?.type === 'input') {
    return renderItemInput(props);
  } else if (item?.type === 'radio') {
    return renderItemRadio(props);
  } else if (item?.type === 'checkbox') {
    return renderItemCheckBox(props);
  } else if (item?.type === 'inputList') {
    return renderItemInputList(props);
  } else if (item?.type === 'date') {
    return renderTimePicker(props);
  } else if (item?.type === 'text') {
    return renderItemText(props);
  } else if (item?.type === 'selectwithicon') {
    return renderItemSelectWithIcon(props);
  } else if (item?.type === 'dropdown') {
    return renderItemPicker(props);
  } else {
    return null;
  }
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    borderBottomWidth: 1,
    marginBottom: 10,
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
  itemSelectWithIconBox: { justifyContent: 'center', alignItems: 'center' },
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
  checkbox: {
    borderColor: colors?.textMuted,
  },
  textInput: {
    paddingLeft: 10,
    width: '60%',
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
