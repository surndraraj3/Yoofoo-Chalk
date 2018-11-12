import React from "react";
import {
  View,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Text
} from "native-base";
import commonStyles from "../styles/styles";
import { baseURL } from "../common/url_config";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userPassword: "",
      errorDetails: false,
      loginData: "",
      spinnerStatus: false,
      distributorId: "",
      searchInput: "",
      clearInput: false,
      clearInputPass: false
    };
  }
  //Get the username from the textbox onchange
  handleUsername = txtUserName => {
    this.setState({ userName: txtUserName });
  };
  //Get the user pass from the textbox onchange
  handleUserPass = txtUserPass => {
    this.setState({ userPassword: txtUserPass });
  };

  //On sign click and validate user and pass
  onSignIn = (user, pass) => {
    this.setState({ spinnerStatus: true });
    fetch(`${baseURL}Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserName: user,
        Password: pass
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        this.setState({
          loginData: responseJson
        });
        if (responseJson.message === "Success") {
          this.setState({ spinnerStatus: false });
          this.props.navigation.navigate("Dashboard");
          AsyncStorage.setItem(
            "LoginDetails",
            JSON.stringify(this.state.loginData)
          );
        } else {
          this.setState({ errorDetails: true, spinnerStatus: false });
          setTimeout(() => {
            this.setState({ errorDetails: false });
          }, 3000);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  // Reset Username
  clearUsername = () => {
    this.setState({ userName: "" });
    this.setState({
      clearInput: !this.state.clearInput
    });
  };
  // Reset Password
  clearPassword = () => {
    this.setState({ userPassword: "" });
    this.setState({
      clearInputPass: !this.state.clearInputPass
    });
  };

  render() {
    return (
      <Container>
        <Content>
          {/* <Text style={commonStyles.logoStyles}>Chalk COUTURE</Text> */}
          <Image
            source={require("../../assets/logo.png")}
            style={{ flexDirection: "row", margin: 40 }}
          />
          <Form>
            <Label style={commonStyles.labelPos}>Username/Email</Label>
            <Item>
              <Input
                onChangeText={this.handleUsername}
                value={!this.state.clearInput ? this.state.userName : null}
              />
              <TouchableOpacity onPress={this.clearUsername}>
                <Icon active name="close-circle" />
              </TouchableOpacity>
            </Item>
            <Label style={commonStyles.labelPos}>Password</Label>
            <Item>
              <Input
                secureTextEntry={true}
                onChangeText={this.handleUserPass}
                value={
                  !this.state.clearInputPass ? this.state.userPassword : null
                }
              />
              <TouchableOpacity onPress={this.clearPassword}>
                <Icon active name="close-circle" />
              </TouchableOpacity>
            </Item>
            {this.state.spinnerStatus && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {this.state.errorDetails && (
              <Label style={commonStyles.errorMsg}>
                {/* Incorrect credentials were supplied */}
                {this.state.loginData.message}
              </Label>
            )}
            <View style={commonStyles.buttonPos}>
              <Text
                style={{ color: "#42f4f1", fontSize: 20, fontWeight: "bold" }}
                onPress={() => {
                  this.onSignIn(this.state.userName, this.state.userPassword);
                }}
              >
                Sign In
              </Text>
            </View>
            {/* <View style={commonStyles.buttonCommonMargin}>
              <Button block light>
                <Text>Auto Fill With Last Pass</Text>
              </Button>
            </View> */}
            <View>
              <Text
                style={commonStyles.forgotPass}
                onPress={() =>
                  this.props.navigation.navigate("ResetCustomerDetails")
                }
              >
                Forgot Password
              </Text>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}
