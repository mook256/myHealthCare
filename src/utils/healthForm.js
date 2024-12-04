import { NEW_COLOR } from './constants';
import DeviceInfo from 'react-native-device-info';
let isTablet = DeviceInfo.isTablet(true);

const healthForm = {
  bp: {
    img: require('../assets/images/new-ui/blood-pressure.png'),
    icon: 'stethoscope',
    iconTitle: 'healthForm:bp.name',
    iconColor: '#388e3c',
    unit: 'healthForm:bp.unit',
    fields: [
      { name: 'sbp', validate: { min: 90, max: 140 } },
      { name: 'dbp', validate: { min: 60, max: 90 } },
    ],
    // if tablet editable null mobile true
    // editable: isTablet ? null : true,
    editable: true,
  },
  bgc: {
    img: require('../assets/images/new-ui/sugar-blood-level.png'),
    icon: 'tint',
    iconTitle: 'healthForm:bgc.name',
    iconColor: '#ff467a',
    unit: 'healthForm:bgc.unit',
    fields: [{ name: 'bgc', validate: { min: 80, max: 200 } }],
    // if tablet editable null mobile true
    // editable: isTablet ? null : true,
    editable: true,
  },
  hr: {
    img: require('../assets/images/new-ui/heart-rate.png'),
    icon: 'heartbeat',
    iconTitle: 'healthForm:hr.name',
    iconColor: '#ff467a',
    unit: 'healthForm:hr.unit',
    fields: [{ name: 'hr', validate: { min: 60, max: 100 } }],
    // if tablet editable null mobile true
    // editable: isTablet ? null : true,
    editable: true,
  },
  temp: {
    img: require('../assets/images/new-ui/temperature.png'),
    icon: 'thermometer-half',
    iconTitle: 'healthForm:temp.name',
    iconColor: '#aa00ff',
    unit: 'healthForm:temp.unit',
    fields: [{ name: 'temp', validate: { min: 35.0, max: 37.5 } }],
    // if tablet editable null mobile true
    // editable: isTablet ? null : true,
    editable: true,
  },
  weight: {
    img: require('../assets/images/new-ui/scale.png'),
    icon: 'male',
    iconTitle: 'healthForm:weight.name',
    iconColor: '#0091ea',
    unit: 'healthForm:weight.unit',
    fields: [{ name: 'weight', format: { precision: 2 } }],
    //enable edittable original
    editable: true,
  },
  height: {
    img: require('../assets/images/new-ui/height.png'),
    iconTitle: 'healthForm:height.name',
    unit: 'healthForm:height.unit',
    fields: [{ name: 'height' }],
    //enable edittable original
    editable: true,
  },
  spo2: {
    img: require('../assets/images/new-ui/oximeter.png'),
    icon: 'hand-point-up',
    iconTitle: 'healthForm:spo2.name',
    iconColor: '#ff8f00',
    unit: 'healthForm:spo2.unit',
    fields: [
      {
        name: 'spo2',
        title: 'healthForm:spo2current.name',
        validate: { min: 95, max: 99 },
      },
      {
        name: 'spo2before',
        title: 'healthForm:spo2before.name',
        validate: { min: 95, max: 99 },
      },
      {
        name: 'spo2after',
        title: 'healthForm:spo2after.name',
        validate: { min: 95, max: 99 },
      },
    ],
    selectable: true,
    // if tablet editable null mobile true
    // editable: isTablet ? null : true,
    editable: true,
  },
  resp: {
    img: require('../assets/images/new-ui/breathing.png'),
    icon: 'wind',
    iconTitle: 'healthForm:resp.name',
    iconColor: '#a7c7e7',
    unit: 'healthForm:resp.unit',
    fields: [{ name: 'resp', validate: { min: 12, max: 25 } }],
    editable: true,
  },
};

const formatField = (field, value) => {
  if (value == null) {
    return null;
  }
  if (field?.format?.precision != null) {
    return parseFloat(value).toFixed(field.format.precision);
  }
  return value;
};

const normalTextColor = '#546e7a'; // grey
const validTextColor = '#00c853'; // green
const dangerTextColor = '#ff1744'; // red

const normalValueColor = NEW_COLOR['light_blue'];
const validValueColor = NEW_COLOR['light_green'];
const dangerValueColor = NEW_COLOR['light_red'];

const colorField = (field, value) => {
  if (value === 0 || field.validate == null) {
    return normalTextColor;
  }
  if (field?.validate?.min != null && value < field.validate.min) {
    return dangerTextColor;
  }

  if (field?.validate?.max != null && value > field.validate.max) {
    return dangerTextColor;
  }
  return validTextColor;
};

const colorBox = (field, value) => {
  if (value === 0 || field.validate == null) {
    return normalValueColor;
  }
  if (field?.validate?.min != null && value < field.validate.min) {
    return dangerValueColor;
  }

  if (field?.validate?.max != null && value > field.validate.max) {
    return dangerValueColor;
  }
  return validValueColor;
};

const initHealthFormState = () => {
  return Object.keys(healthForm).reduce((forms, name) => {
    const form = healthForm[name];
    let state = {};
    if (form.selectable) {
      state.choices = 0;
    }
    return { ...forms, [name]: state };
  }, {});
};

const isSelectableField = (fieldName) => {
  const form = Object.values(healthForm).find((form) =>
    form.fields.map((field) => field.name).includes(fieldName),
  );
  return form?.selectable || false;
};

export {
  healthForm,
  formatField,
  colorField,
  initHealthFormState,
  isSelectableField,
  colorBox,
};
