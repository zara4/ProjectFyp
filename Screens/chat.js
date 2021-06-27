import React from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, AsyncStorage, FlatList } from 'react-native'
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Fire from './../FIre'
import database from '@react-native-firebase/database';
import Userprofile from '../Components/userProfile'
import FIre from './../FIre';
import User from '../Components/User';
import { Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native';

export default class chat extends React.Component {

  state = {
    messages: [],
    senderid: '',
    message: '',
    chat: [],
  }

  get user() {
    return {
      _id: User.uid,
      name: User.name
    }
  }

  componentDidMount = async () => {
    this.getChat()
    // firebase.database().ref("chat").on("child_added", function (snapshot) {
    //   console.log(snapshot)
    //   this.set(snapshot)
    // })


    // const value = await AsyncStorage.getItem('senderid');
    // this.setState({ senderid: value })
    // Fire.get(message =>
    //   this.setState(previous => ({
    //     messages: GiftedChat.append(previous.messages, message)
    //   }))
    // );
  }
  getChat = async () => {

    const chatlist = await AsyncStorage.getItem('chatlist');

    if (chatlist == 0) {
      const userid = User.uid;
      const senderid = await AsyncStorage.getItem('senderid');
      const chatid = userid + senderid;
    

      var ref = firebase.database().ref("chat").orderByChild("chatid").equalTo(chatid);

      ref.once('value').then(snapshot => {
        var items = [];
        snapshot.forEach((child) => {
          items.push({
            sender: child.val().sender,
            message: child.val().message,

          });
        });
        this.setState({ chat: items });
        // console.log(items)
      });
    }

    if (chatlist == 1) {
      const userid = User.uid;
      const senderid = await AsyncStorage.getItem('senderid');
      const chatid = senderid + userid;
      
      var ref = firebase.database().ref("chat").orderByChild("chatid").equalTo(chatid);

      ref.once('value').then(snapshot => {
        var items = [];
        snapshot.forEach((child) => {
          items.push({
            sender: child.val().sender,
            message: child.val().message,

          });
        });
        this.setState({ chat: items });
        // console.log(items)
      });
    }


  }

  componentWillUnmount() {
    Fire.off();
  }

  register = async () => {
    const chatlist = await AsyncStorage.getItem('chatlist');

    if (chatlist == 0) {

      const { message } = this.state;
      const username = User.name;
      const userid = User.uid;
      const senderid = await AsyncStorage.getItem('senderid');
      const chatid = userid + senderid;

      if (username == null) {
        alert('Please set username in profile setting first.');
        return;
      } else if (message == '') {
        alert('Plese write some message.');
        return;
      } else {

        firebase.database().ref("chat").push().set({
          "sender": username,
          "message": message,
          "chatid": chatid,
        });

        this.setState({ message: '' })
        this.getChat();

      }

    }

    if (chatlist == 1) {

      const { message } = this.state;
      const username = User.name;
      const userid = User.uid;
      const senderid = await AsyncStorage.getItem('senderid');
      const chatid =  senderid + userid;

      if (username == null) {
        alert('Please set username in profile setting first.');
        return;
      } else if (message == '') {
        alert('Plese write some message.');
        return;
      } else {

        firebase.database().ref("chat").push().set({
          "sender": username,
          "message": message,
          "chatid": chatid,
        });

        this.setState({ message: '' })
        this.getChat();

      }

    }


  }

  send = messages => {
    messages.forEach(item => {
      const message = {
        sendTo: this.state.senderid,
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      }

      this.db.push(message)
    })
  }

  get db() {
    return firebase.database().ref("messages");
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid
  }

  goback = async () => {
    await AsyncStorage.setItem('senderid', '');
    this.props.navigation.goBack(null)
  }

  renderDayRow = ({ item }) => {

    if (item.sender != User.name) {
      return (
        <View>

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '70%', padding: 10 }}>
              <Text style={{
                backgroundColor: '#fff', shadowColor: "#000",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,

                padding: 10,
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10
              }}>
                {item.message}
              </Text>
            </View>
          </View>


        </View>
      )
    }
    else {
      return (
        <View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '30%' }}></View>
            <View style={{ width: '70%', padding: 10 }}>
              <Text style={{ color: 'white', backgroundColor: '#000', padding: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }}>
                {item.message}
              </Text>
            </View>
          </View>
        </View>
      )

    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 40,
            width: "100%"
          }}>
            <TouchableOpacity onPress={() => this.goback()} style={{ width: "20%" }}>
              <Image
                source={require('./../assets/backwhite.png')}
                style={{ height: 30, width: 30, marginTop: 10 }}
              />
            </TouchableOpacity>

          </View>
        </View>

        <ScrollView>
          <FlatList
            pagingEnabled
            data={this.state.chat}
            renderItem={this.renderDayRow}
            keyExtractor={item => item.id}
          />

        </ScrollView>

        <View style={{ flexDirection: 'row', backgroundColor: '#f4f4f8', marginHorizontal: wp('2%'), height: hp('9%'), marginBottom: hp('1%'), padding: 7 }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <KeyboardAvoidingView behavior='padding' >
                <TextInput
                  placeholder={'Type a message'}
                  style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, height: hp('7%'), width: wp('80%') }}
                  onChangeText={message => this.setState({ message })}
                  multiline={true}
                  value={this.state.message}
                />
              </KeyboardAvoidingView>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: wp('3.5%') }}>

              <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.register()}>
                  <Text>Send</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>

      </View>

    )

  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#FFF",
    flex: 1
  },
  mainContainer: {
    backgroundColor: "#111",
    height: "14%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20
  },
  headText: {
    fontSize: 20,
    color: "#FFF",
  },
  bodyText: {
    fontSize: 20,
    color: "#333",
    alignSelf: "center"
  },
});
