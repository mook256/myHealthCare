const initialState = {
  patient: [],
  mCoin: 0,
  activities: {
    data: [0],
    cal: 0,
    info: '',
  },
  userdetail: {
    age: 0,
    gender: 'Male',
    healthdata: {},
    bmr: 2000,
  },
  food: {
    cal: 0,
    carb_percent: 0,
    fat_percent: 0,
    info: '',
    prot_percent: 0,
    sodium_percent: 0,
  },
  labResult: {
    good: '',
    bad: '',
    setbad: 0,
    caution: [],
    setcaution: 0,
    latestCheckBy: {},
  },
  specialclinic: [],
  doctorData: [],
  todayUha: {
    actkcal: 0,
    dateStr: '',
    foodcarb: 0,
    foodchor: 0,
    foodfat: 0,
    foodkcal: 0,
    foodprot: 0,
    foodsod: 0,
    medUse: 0,
  },
  currentLocation: {
    airQuality: {
      pm25: 0,
    },
  },
  appUsage: [],
  lastAction: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOOKUP_FAILURE': {
      const newState = Object.assign({}, state);
      newState.patient = initialState.patient;
      newState.mCoin = initialState.mCoin;
      return newState;
    }
    case 'USER_LOOKUP_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.patient = action.json.patient;
      newState.userdetail = action.json.userdetail;
      newState.mCoin = action.json.mCoin;
      return newState;
    }
    case 'HEALTH_FETCH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.activities = initialState.activities;
      newState.food = initialState.food;
      newState.labResult = initialState.labResult;
      return newState;
    }
    case 'HEALTH_FETCH_SUCCESS': {
      const { activity, food, labResult, medicine } = action.json;
      const newState = Object.assign({}, state);
      newState.activities = { ...newState.activities, ...activity };
      newState.food = { ...newState.food, ...food };
      newState.labResult = { ...newState.labResult, ...labResult };
      newState.medicine = medicine;
      return newState;
    }
    case 'FETCH_LATEST_HEALTH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.labResult = initialState.labResult;
      return newState;
    }
    case 'FETCH_LATEST_HEALTH_SUCCESS': {
      const { labResult } = action.json;
      const newState = Object.assign({}, state);
      newState.labResult = { ...newState.labResult, ...labResult };
      return newState;
    }
    case 'SPECIAL_CLINIC_LOOKUP_FAILURE': {
      const newState = Object.assign({}, state);
      newState.specialclinic = initialState.specialclinic;
      newState.doctorData = initialState.doctorData;
      return newState;
    }
    case 'SPECIAL_CLINIC_LOOKUP_SUCCESS': {
      const { specialclinic, doctorData } = action.json;
      const newState = Object.assign({}, state);
      newState.specialclinic = specialclinic;
      newState.doctorData = doctorData;
      return newState;
    }
    case 'UHA_TODAY_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.todayUha = action.json;
      return newState;
    }
    case 'UHA_TODAY_FAILURES': {
      const newState = Object.assign({}, state);
      newState.todayUha = initialState.todayUha;
      return newState;
    }
    case 'UHA_MEDICINE_USE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.todayUha = action.json;
      return newState;
    }
    case 'AHQL_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.currentLocation = action.json;
      return newState;
    }
    case 'AHQL_FAILURES': {
      const newState = Object.assign({}, state);
      newState.currentLocation = initialState.currentLocation;
      return newState;
    }
    case 'APP_USAGE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.appUsage = action.json;
      return newState;
    }
    case 'APP_USAGE_FAILURES': {
      const newState = Object.assign({}, state);
      newState.appUsage = initialState.appUsage;
      return newState;
    }
    case 'LAST_ACTION_SETTING_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.lastAction = action.json;
      return newState;
    }
    case 'LAST_ACTION_SETTING_FAILURE': {
      const newState = Object.assign({}, state);
      newState.lastAction = initialState.lastAction;
      return newState;
    }
    default: {
      return state;
    }
  }
}
