/**
 * these are functions for read config on database but try to remain compatibility
 * on the old config
 */

/**
 * config v1
 * {  // config when setup
 *  deviceKey: string,
 *  loading: boolean,
 *  error: string | null,
 *  users: [{idcard: string, userid: string, firstname: string, surname: string}] | undefined,
 *  auth: {username: string, password: string}
 *  config: {  // config from database
 *    partner: {
 *      partnerid: string  // hospital userid
 *      emergencyNurseUserid: string | undefined  // user for emergency nurse feature (empty string mean undefined)
 *    },
 *    images: {  // image on each page, but some are used to control feature
 *      [key]: string;
 *    }
 *  }
 * }
 *
 */

/**
 * config v2
 * {  // config when setup
 *  deviceKey: string,
 *  loading: boolean,
 *  error: string | null,
 *  users: [{idcard: string, userid: string, firstname: string, surname: string}] | undefined,
 *  auth: {username: string, password: string}
 *  config: {  // config from database
 *    partner: {
 *      partnerid: string  // hospital userid
 *      // remove emergencyNurseUserid
 *    },
 *    features: {  // new in v2, for control feature in mhc  (as [key]: {params})
 *      teleclinic: {},
 *      covidRecord: {},
 *      teleBooking: {},
 *      healthAnalytic: {},
 *      emergencyNurse: { userid: string }  // move emergency nurse from partnerid to here
 *      sos: { telephoneNumber: string? }
 *    },
 *    display: {  new in v2, for control display in mhc  (code must check exists feature first)
 *      homeScreen: {
 *        actionButtons [
 *          'emergencyNurse',
 *        ],
 *      },
 *      mainScreen: {
 *        actionButtons: [  // use array for ordering btn
 *          'teleclinic',
 *          'covidRecord',
 *          'teleBooking',
 *          'heatlhAnalytic',
 *        ]
 *      },
 *    }
 *    images: {  // now this image cannot control feature, but must have if feature exists
 *      [key]: string;
 *    }
 *  }
 * }
 *
 */

// feature for support
const supportFeatureV2 = {
  emergencyNurse: {
    valid(config) {
      return config?.features?.emergencyNurse?.userid?.length > 0;
    },
  },
  teleclinic: {
    valid(config) {
      return config?.images?.mainPage2_en && config?.images?.mainPage2_th;
    },
  },
  covidRecord: {
    valid(config) {
      return (
        config?.images?.covidHealthPage_en &&
        config?.images?.covidHealthPage_th &&
        config?.images?.covidMentalPage_en &&
        config?.images?.covidMentalPage_en
      );
    },
  },
  teleBooking: {
    valid(config) {
      return (
        config?.images?.teleBookingPage_en && config?.images?.teleBookingPage_th
      );
    },
  },
  healthAnalytic: {
    valid(config) {
      return (
        config?.images?.healthAnalyticPage_en &&
        config?.images?.healthAnalyticPage_th
      );
    },
  },
  adl: {
    valid(config) {
      return config?.images?.adlPage_en && config?.images?.adlPage_th;
    },
  },
  eldH: {
    valid(config) {
      return config?.images?.eldHPage_en && config?.images?.eldHPage_th;
    },
  },
  caregiver: {
    valid(config) {
      return (
        config?.images?.caregiverPage_en && config?.images?.caregiverPage_th
      );
    },
  },
  esasPage: {
    valid(config) {
      return config?.images?.esasPage_en && config?.images?.esasPage_th;
    },
  },
  facePain: {
    valid(config) {
      return config?.images?.facePage_en && config?.images?.facePage_th;
    },
  },
  ppsPage: {
    valid(config) {
      return config?.images?.ppsPage_en && config?.images?.ppsPage_th;
    },
  },
  posPage: {
    valid(config) {
      return config?.images?.posPage_en && config?.images?.posPage_th;
    },
  },
  mhl: {
    valid(config) {
      return true;
    },
  },
  sos: {
    valid(config) {
      return true;
    },
  },
};

/**
 * check if type is valid
 * @param {*} config
 * @param {{type: string, params: *}} feature
 * @returns {boolean}
 */
function isValidFeatureV2(config, feature) {
  // console.log('config', config);
  // console.log('feature', feature);
  return (
    supportFeatureV2.hasOwnProperty(feature.type) &&
    supportFeatureV2[feature.type]?.valid(config)
  );
}
/**
 * check if it's v2 config
 * @param {*} config feature from database
 * @returns feature object or null
 */
function supportV2Config(config) {
  return config?.features != null;
}

/**
 *
 * @param {*} config config from database
 * @returns image list for program
 */
export function images(config) {
  return config.images;
}

export function homeScreenActionButtons(config) {
  if (supportV2Config(config)) {
    const actionButtons = config?.display?.homeScreen?.actionButtons;
    if (!Array.isArray(actionButtons)) {
      // in case config is error;
      return [];
    }
    return actionButtons
      .filter((name) => config?.features?.hasOwnProperty(name))
      .map((name) => ({ type: name, params: config?.features?.[name] }))
      .filter((type) => isValidFeatureV2(config, type));
  }

  // v1 backward compatible
  if (
    config?.partner?.emergencyNurseUserid == null ||
    typeof config?.partner?.emergencyNurseUserid !== 'string' ||
    config?.partner?.emergencyNurseUserid.length === 0
  ) {
    return [];
  }
  return [
    {
      type: 'emergencyNurse',
      params: { userid: config?.partner?.emergencyNurseUserid },
    },
  ];
}

/**
 *
 * @param {*} config config from database
 * @returns action buttons list for main screen as { type: 'featureName', params: {} if (feature has config) }
 */
export function mainScreenActionButtons(config) {
  if (supportV2Config(config)) {
    const actionButtons = config?.display?.mainScreen?.actionButtons;
    if (!Array.isArray(actionButtons)) {
      // in case config is error;
      return [];
    }
    return actionButtons
      .filter((name) => config?.features?.hasOwnProperty(name))
      .map((name) => ({ type: name, params: config?.features?.[name] }))
      .filter((type) => isValidFeatureV2(config, type));
  }
  // v1 backward compatible

  let btns = [];
  const hasTeleclinicImage =
    config?.images?.mainPage2_en && config?.images?.mainPage2_th;
  if (hasTeleclinicImage) {
    btns.push({ type: 'teleclinic' });
  }
  const hasCovidPageImage =
    config?.images?.covidHealthPage_en &&
    config?.images?.covidHealthPage_th &&
    config?.images?.covidMentalPage_en &&
    config?.images?.covidMentalPage_en;
  if (hasCovidPageImage) {
    btns.push({ type: 'covidRecord' });
  }
  return btns;
}
