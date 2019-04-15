import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  TextInput,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Button,
  Header,
  Body,
  Title,
  Right
} from "native-base";
import commonStyles from "../styles/styles";
import { resetPasswordUrl } from "../common/url_config";

const windowWidth = Dimensions.get("window").width;

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      resetEmailId: "",
      validateEmail: "",
      errorEmail: false,
      msgSuccess: "",
      msgSuccessState: false,
      btnActiveState: true
    };
  }

  // Check email is exists in the system
  checkEmailIsInSystem = () => {    
    fetch(`${resetPasswordUrl}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.resetEmailId
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          msgSuccess: responseJson.message,
          msgSuccessState: true
        });
        setTimeout(() => {
          this.props.navigation.navigate("Login");
        }, 2000);
      })
      .catch(error => {
        console.error(error);
      });
  };
  onEmailChange = txtEmail => {
    this.setState({ resetEmailId: txtEmail });
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(txtEmail) === false) {
      this.setState({
        validateEmail: "Invalid Email",
        errorEmail: true,
        btnActiveState: true
      });
      return false;
    } else {
      this.setState({ validateEmail: "Email is Correct", errorEmail: false, btnActiveState: false });
    }
  };

  render() {
    return (
      <Container>        
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <View style={{ flex: 2, justifyContent: "center" }}>
            <Title>Reset Password</Title>
          </View>
          <Right>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Icon
                name="sign-in"
                type="FontAwesome"
                style={{ color: "#ffffff" }}
              />
            </TouchableHighlight>
          </Right>
        </Header>
        <Content>
          <View
            style={{
              flexDirection: "row",
              margin: 40,
              justifyContent: "space-around"
            }}
          >
            <Image source={require("../../assets/logo.png")} />
          </View>
          <Form>
            <Label style={commonStyles.labelPos}>Email</Label>
            {/* <Item> */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}
            >
              <TextInput
                style={{ flex: 1, color: "#413E4F" }}
                onChangeText={this.onEmailChange}
                value={this.state.resetEmailId}
                placeholderTextColor="#413E4F"
                autoCapitalize="sentences"
                selectTextOnFocus={true}
                ref={ref => {
                  this._emailInput = ref;
                }}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
              <Icon active name="close-circle" />
            </View>
            <View>
              {this.state.errorEmail && (
                <Label style={commonStyles.errorMsg}>
                  {this.state.validateEmail}
                </Label>
              )}
            </View>
            {/* </Item> */}
            <View style={{ justifyContent: "space-around", padding: 15 }}>
              <Button
                style={{
                  backgroundColor: "#61d0c8",
                  width: windowWidth - 20,
                  justifyContent: "space-around"
                }}
                disabled={this.state.btnActiveState}
                onPress={this.checkEmailIsInSystem}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#ffffff" }}
                >
                  Submit
                </Text>
              </Button>
            </View>
            <View>
              {this.state.msgSuccessState && (
                <Label style={commonStyles.errorMsg}>
                  {this.state.msgSuccess}
                </Label>
              )}
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}
