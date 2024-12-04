import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import store from '../../redux/stores';
import { clearCurrentUser } from '../../redux/actions/currentuser';

export default class SuccessScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text>ดำเนินการเสร็จสิ้น ขอบคุณที่ใช้บริการ</Text>
        <Text style={styles.pullCardText}>หรือดึงบัตรออกเพื่อออกจากระบบ</Text>
        <Text>หรือ</Text>
        <TouchableOpacity
          onPress={() => store.dispatch(clearCurrentUser(navigation))}
          style={styles.logoutBtn}>
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#28a745',
    borderRadius: 15,
    marginTop: 15,
  },
  pullCardText: {
    marginVertical: 15,
    fontSize: 20,
  },
  logoutText: {
    marginHorizontal: 80,
    marginVertical: 15,
    color: '#fff',
    fontSize: 25,
  },
});
