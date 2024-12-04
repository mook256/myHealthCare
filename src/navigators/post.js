import { createSwitchNavigator } from 'react-navigation';
import PostScreen from '../screens/post/PostScreen';
import CameraScreen from '../screens/post/CameraScreen';

export default createSwitchNavigator(
  {
    Post: {
      screen: PostScreen,
      headerForceInset: { top: 'never', bottom: 'never' },
    },
    VoicePost: {
      screen: PostScreen,
      headerForceInset: { top: 'never', bottom: 'never' },
    },
    Camera: CameraScreen,
  },
  {
    initialRouteName: 'Post',
  },
);
