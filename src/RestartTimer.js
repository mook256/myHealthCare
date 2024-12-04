import RNRestart from 'react-native-restart';
import BackgroundTimer from 'react-native-background-timer';


// single object
let intervalId = null;

/**
 * start the restart timer
 */
const start = () => {
   stop();
   intervalId = BackgroundTimer.setInterval(() => {
      // this will be executed every 1 hr
      // even when app is the the background
      RNRestart.Restart();
   }, 3600000);
}

// 3600000 = 1 hour

/**
 * stop the restart timer
 */
const stop = () => {
   if (intervalId != null) {
      BackgroundTimer.clearInterval(intervalId);
      intervalId = null;
   }
}

export default {
   start,
   stop,
}