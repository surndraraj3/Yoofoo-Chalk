import React, { Component } from "react";
import { View, TextInput } from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Icon,
  Text
} from "native-base";
import commonStyles from "../styles/styles";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userPassword: "",
      errorDetails: false
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
    if (user === "exigo" && pass === "exigo") {
      this.props.navigation.navigate("Dashboard");
      //   this.props.navigation.navigate({ routeName: "Dashboard" });
      // alert("Login Success");
    } else {
      this.setState({ errorDetails: true });
      setTimeout(() => {
        this.setState({ errorDetails: false });
      }, 3000);
      //   alert("Failed to login");
    }
  };
  render() {
    return (
      <Container>
        <Content>
          <Text style={commonStyles.logoStyles}>Chalk COUTURE</Text>
          <Form>
            <Label style={commonStyles.labelPos}>Username/Email</Label>
            <Item>
              <Input onChangeText={this.handleUsername} />
              <Icon active name="close-circle" />
            </Item>
            <Label style={commonStyles.labelPos}>Password</Label>
            <Item>
              <Input
                secureTextEntry={true}
                onChangeText={this.handleUserPass}
              />
              <Icon active name="close-circle" />
            </Item>
            {this.state.errorDetails && (
              <Label style={commonStyles.errorMsg}>
                 Incorrect credentials were supplied
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
            <View style={commonStyles.buttonCommonMargin}>
              <Button block light>
                <Text>Auto Fill With Last Pass</Text>
              </Button>
            </View>
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
