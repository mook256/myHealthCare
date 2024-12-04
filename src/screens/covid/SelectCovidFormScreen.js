import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import TopNav from '../../components/TopNav';
import BackButton from '../../components/buttons/BackButton';

export default class SelectCovidFormScreen extends Component {
  render() {
    const {
      navigation,
      user,
      authentication,
      currentuser,
      config,
    } = this.props;
    const healthURL =
      'https://hospitan.capsuledna.com/files/mhc/shared/v1/main_page_2_th.jpg';
    const mentalHealthURL =
      'https://hospitan.capsuledna.com/files/mhc/shared/v1/main_page_2_th.jpg';
    return (
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate('CovidHealthForm');
            }}>
            <Image
              source={{ uri: healthURL }}
              style={{ width: '100%', height: '100%' }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate('CovidMentalHealthForm');
            }}>
            <Image
              source={{ uri: mentalHealthURL }}
              style={{ width: '100%', height: '100%' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BLOCK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: BLOCK_HEIGHT,
    width: SCREEN_WIDTH * 0.3,
    borderRadius: 20,
    marginLeft: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
  },
});
