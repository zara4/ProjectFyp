import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage
} from "react-native";
import "firebase/firestore";
import firebase from "firebase";
import User from '../Components/User';
class SignInScreen extends React.Component {

  state = { email: '', password: '', errorMessage: '', loading: false };

  setUser = async () => {
    // console.log('START: ' + User.name)
    // alert(User.name)
    User.email = this.state.email;
    User.password = this.state.password;
    User.error = this.state.errorMessage;
    User.loading = this.state.loading;
  }
  onClear() {
    this.setState({ email: "", password: "" }, function () {
      console.log(this.state.data);
    }.bind(this));
  }
  onLoginSuccess() {
    this.props.navigation.navigate('Home');
    this.setUser();
    this.userD();
  }

  userD() {
    const uid = firebase.auth().currentUser.uid
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then(function (snapshot) {
        var username = snapshot.child("name").val();
        console.log('USERNAME: ' + username)
        var usercnic = snapshot.child("cnic").val();
        var usergender = snapshot.child("gender").val();
        var userphone = snapshot.child("phone").val();
        var usercountry = snapshot.child("country").val();
        var usercity = snapshot.child("city").val();
        var useraddress = snapshot.child("address").val();
        var userimg = snapshot.child("image").val();
        User.uid = uid
        User.name = username

      });

  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false });
  }
  renderLoading() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }
  async signInWithEmail() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.onLoginSuccess.bind(this))
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          this.onLoginFailure.bind(this)('Weak Password!');
        } else {
          this.onLoginFailure.bind(this)(errorMessage);
        }
      });

  }
  render() {

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">

            <View style={styles.form}>
              <Image source={require('./../assets/signin-image.jpg')}
                style={{ marginTop: 20, height: 150, width: 120, alignSelf: "center" }} />
              <View style={{ marginTop: 20, marginBottom: 16 }}>
                <Text
                  style={{ fontSize: 24, textAlign: "center" }}
                  onPress={() => {
                    this.props.navigation.navigate("Signup");
                  }}>
                  Login to your Account
              </Text>
              </View>
              <View>
                <Text
                  style={{ fontWeight: "200", fontSize: 13, textAlign: "center" }}>
                  Simply add your email and password to save lives
              </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B1B1B1"
                returnKeyType="next"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B1B1B1"
                returnKeyType="done"
                textContentType="newPassword"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </View>

            {this.renderLoading()}
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
                color: "red",
                width: "80%"
              }}
            >
              {this.state.error}
            </Text>
            <TouchableOpacity
              style={{ width: "86%", marginTop: 10 }}
              onPress={() => this.signInWithEmail()}>
              <View style={styles.emailbutton}>
                <Text
                  style={{
                    letterSpacing: 0.5,
                    fontSize: 16,
                    color: "#FFFFFF"
                  }}
                >
                  Sign In With Email
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ fontWeight: "200", fontSize: 17, textAlign: "center" }}
                onPress={() => {
                  this.props.navigation.navigate("Signup");
                }}>
                Don't have an Account?
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ fontSize: 15, textAlign: "center", color: "blue" }}
                onPress={() => {
                  this.props.navigation.navigate("ForgotPassword");
                }}>
                Forgot Password?
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'white',
    alignItems: "center",
    alignContent: "center"
  },
  form: {
    width: "80%",
    marginTop: 45
  },
  input: {
    fontSize: 15,
    borderColor: "#999",
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 6,
    paddingLeft: 15,
    marginTop: 15.5
  },
  emailbutton: {
    backgroundColor: "#222",
    height: 44,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22
  },
});
export default SignInScreen;