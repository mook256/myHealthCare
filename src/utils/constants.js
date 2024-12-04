export const PARSE_HOST = 'http://mhf-parse.capsuledna.com:1339/parse';
export const PARSE_WS_HOST = 'ws://mhf-parse.capsuledna.com:1339/parse';
export const AGORA_APP_ID = '9d29a0964afb4cedba92edd8664b67ea';
export const TELE_HOST = 'https://telereserve.myhealthgroup.net';
export const VIDEO_CALL_URL = 'https://chat.myhealthgroup.net/api/v1/videocall';
export const VIDEO_CALL_URL_V2 =
  'https://chat.myhealthgroup.net/v3/me/videocall';
export const CHAT_URL = 'https://chat.myhealthgroup.net/v1';
export const MHW_HOST_OLD = 'https://hospitan.capsuledna.com';
export const MHW_HOST = 'https://www.myhealthgroup.net';
export const MHW_HOST_V2 = 'https://v2.myhealthgroup.net';
export const IPPC = 'http://localhost:8888';
export const CHAT_URL_IMAGE = `${CHAT_URL.replace('/v1', '')}/uploads`;
export const CHAT_API_KEY = 'me1tmoru01TOi5Ss1x';
export const FILE_SERVER = 'http://file.myhealthgroup.net/public';
export const CHAT_LIVE_QUERY = {
  applicationId: '02WSl0T0QPqDKh3WGGAglEFLWyee8nN4HndyJWO5',
  serverURL: 'wss://chat.myhealthgroup.net/',
  javascriptKey: '2yWKjvNZbD1amT6FxvgQBkfRVFcgMqcddd1A6ulMM',
};
export const CONFIG_URL = 'https://v2.myhealthgroup.net/mhccontrol/api';

// export const PARSE_HOST = 'https://appservedev.myhealthgroup.net/parse';
// export const PARSE_WS_HOST = 'wss://appservedev.myhealthgroup.net/parse';
// export const AGORA_APP_ID = '9d29a0964afb4cedba92edd8664b67ea';
// export const TELE_HOST = "https://telereservedev.myhealthgroup.net";
// export const VIDEO_CALL_URL = 'https://chatdev.myhealthgroup.net/api/v1/videocall';
// export const VIDEO_CALL_URL_V2 = 'https://chatdev.myhealthgroup.net/v3/me/videocall';
// export const CHAT_URL = 'https://chatdev.myhealthgroup.net/v1';
// export const MHW_HOST_OLD = 'https://hospitan.capsuledna.com';
// export const MHW_HOST = 'https://v2dev.myhealthgroup.net';
// export const MHW_HOST_V2 = 'https://v2dev.myhealthgroup.net';
// export const CHAT_URL_IMAGE = `${CHAT_URL.replace('/v1', '')}/uploads`;
// export const CHAT_API_KEY = 'me1tmoru01TOi5Ss1x';
// export const CHAT_LIVE_QUERY = {
//   applicationId: "02WSl0T0QPqDKh3WGGAglEFLWyee8nN4HndyJWO5",
//   serverURL: "wss://chatdev.myhealthgroup.net/",
//   javascriptKey: "2yWKjvNZbD1amT6FxvgQBkfRVFcgMqcddd1A6ulMM",
// };
// export const CONFIG_URL = 'https://v2dev.myhealthgroup.net/mhccontrol/api';

export const PARSE_APP_ID = 'KSAFJCER1243FDEDASD111';
export const PARSE_JAVASCRIPT_KEY = 'KSAFJCER1243FDEDASD111';
export const PARSE_MASTER_KEY = 'KSAFJCER1243FDEDASD111';

export const VIDEO_CALL_API_KEY_V2 = 'me1tmoru01TOi5Ss1x';

export const GCM_ID = '189902797037';
export const MHW_FILE_HOST = 'https://file.myhealthgroup.net/public';
export const MHW_API_KEY = 'Io5rR3ngWsB0u3F1TOQz7wDsKWObkAX8Izm1pGhr';
export const MHW_API_SERVICE_KEY = '32a9fcf38fb1aebaed';

export const SilverCareBearer =
  'bTEyOVFMbE9kZ2M1em1hNEN3c0dwSVlrQVBvaWJ2VU1ha0llc2VjYmlNQWJhdk4yaG54ejdad282dXc9Oj13PTqnvR9MFuKY5KQuNuU6PXc9OroxzTL2frorOQgWEKoQ45k=';
export const AVATAR_URL = `${MHW_FILE_HOST}/avatar_120`;
export const DOCTOR_IMAGE_URL = `${MHW_FILE_HOST}/doctors_img`;
export const INSTRUCTION_VIDEO_URL = `${MHW_FILE_HOST}/mhc/MHC_Instruction.mp4`;
export const LICENSE_AGREEMENT_URL = `${MHW_HOST_V2}/mobileservice/page/licensemain`;

// export const FORM_ESAS_URL = `${IPPC}/mobile/page/mhc_form-esas`;
// export const FORM_FACE_URL = `${IPPC}/mobile/page/mhc_form-fpsr`;
// export const FORM_PPS_URL = `${IPPC}/mobile/page/mhc_form-pps`;
// export const FORM_POS_URL = `${IPPC}/mobile/page/mhc_form-posv1`;
export const FORM_ESAS_URL = `${MHW_HOST_V2}/mobile/page/mhc_form-esas`;
export const FORM_FACE_URL = `${MHW_HOST_V2}/mobile/page/mhc_form-fpsr`;
export const FORM_PPS_URL = `${MHW_HOST_V2}/mobile/page/mhc_form-pps`;
export const FORM_POS_URL = `${MHW_HOST_V2}/mobile/page/mhc_form-posv1`;

export const DOCTOR_BOOKING_URL =
  'https://www.myhealthgroup.net/plugtablet/page/teleclinicdocbooking';
export const MHC_HEALTH_ANALYTIC_URL =
  'https://www.myhealthgroup.net/plugtablet/page/healthanalytic';
export const MHC_SOS_URL = 'https://www.myhealthgroup.net/service/rtclinic/sos';

// it use i18n translation trick like TRANSLATE_BUTTON_IMAGES[t('buttons:lang')]
export const TRANSLATE_BUTTON_IMAGES = {
  lang_en: require('../assets/buttons/lang_btn.png'),
  lang_th: require('../assets/buttons/lang_btn.png'),
  help_en: require('../assets/buttons/help_btn.png'),
  help_th: require('../assets/buttons/help_btn.png'),
  nurse_en: require('../assets/buttons/nurse_btn.png'),
  nurse_th: require('../assets/buttons/nurse_btn.png'),
  idcard1_th: require('../assets/buttons/idcard1_th_btn.png'),
  idcard1_en: require('../assets/buttons/idcard1_en_btn.png'),
  idcard2_th: require('../assets/buttons/idcard2_th_btn.png'),
  idcard2_en: require('../assets/buttons/idcard2_en_btn.png'),
  qrcode1_th: require('../assets/buttons/qrcode1_th_btn.png'),
  qrcode1_en: require('../assets/buttons/qrcode1_en_btn.png'),
  qrcode2_th: require('../assets/buttons/qrcode2_th_btn.png'),
  qrcode2_en: require('../assets/buttons/qrcode2_en_btn.png'),
  sos: require('../assets/buttons/sos_btn.png'),
  license: require('../assets/buttons/license_btn.png'),
  mhl: require('../assets/buttons/mhl_btn.png'),

  setting: require('../assets/buttons/settings.png'),
  language: require('../assets/buttons/language.png'),
  questions: require('../assets/buttons/questions.png'),
  nurse2: require('../assets/buttons/nurse2.png'),
  sos2: require('../assets/buttons/emergency-call.png'),
  license2: require('../assets/buttons/license2.png'),
  idcard3: require('../assets/buttons/dc_1.png'),
  qrcode3: require('../assets/buttons/qr-code-3.png'),

  esas_th: require('../assets/images/form/esas.png'),
};

// use in bluetooth config (might be change in the future)
export const BLUETOOTH_CONFIG_ACCESS_PASSWORD = 'asd456';

export const COLOR_LOW = {
  red: '#FF5959',
  pink: '#F57070',
  green: '#8BCA65',
  blue: '#92CEF9',
  purple: '#D792F9',
  yellow: '#F2E25D',
  orange: '#FBA479',
  grey: '#8A8A8A',
  white: '#FFFFFF',
  black: '#000000',
};

export const NEW_COLOR = {
  blue: '#0071ce',
  light_blue: 'rgba(0, 113, 206, 0.2)',
  yellow: '#faa61b',
  light_yellow: 'rgba(250, 166, 27, 0.2)',
  purple: '#815ab2',
  light_purple: 'rgba(129, 90, 178, 0.2)',
  orange: '#f87a1e',
  light_orange: 'rgba(248, 122, 30, 0.2)',
  green: '#27bb99',
  light_green: 'rgba(39, 187, 153, 0.2)',
  red: '#db5669',
  light_red: 'rgba(219, 86, 105, 0.2)',
  gray: '#ebebeb',
  light_gray: 'rgba(235, 235, 235,0.2)',
  white: '#ffffff',
};
