import React from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  Keyboard,
  KeyboardAvoidingView,
  TouchableHighlight
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
  Left,
  Right,
  TitleCard,
  Title,
  CardItem,
  Card
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import Toast from "react-native-simple-toast";
import { add_customerURL } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class AddCutsomer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      valBillingAddress: false,
      customerEmail: "",
      customerFirstName: "",
      customerLastName: "",
      customerPhoneNUmber: "",
      customerStreet: "",
      customerCity: "",
      customerState: "",
      customerZipCode: "",
      validateEmail: "",
      errorEmail: false,
      loadSpinner: false,
      loadFormMessage: false,
      customerData: "",
      distributorId: "",
      authToken: ""
    };
  }
  //Get Distributor Id from sync storage
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails")
      // .then(response => response.json())
      .then(responseJson => {
        responseJson = JSON.parse(responseJson);
        //console.log(responseJson.message, responseJson.DistributorID);
        if (this._isMounted) {
          this.setState({
            distributorId: responseJson.DistributorID,
            authToken: responseJson.Token
          });
        }
      });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  //Display Billing Address form based on condition
  onBillingAddressChange = itm => {
    // console.log("itm", itm);
    if (itm) this.setState({ valBillingAddress: true });
    else this.setState({ valBillingAddress: false });
  };
  //Get Email from textbox
  onEmailChange = txtEmail => {
    this.setState({ customerEmail: txtEmail });
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(txtEmail) === false) {
      // console.log("Email is Not Correct");
      this.setState({
        validateEmail: "Invalid Email",
        errorEmail: true
      });
      return false;
    } else {
      this.setState({ validateEmail: "Email is Correct", errorEmail: false });
      // console.log("Email is Correct");
    }
  };
  // Get First Name from textbox
  onFirstNameChange = txtFirstName => {
    this.setState({ customerFirstName: txtFirstName });
  };
  //Get Last name from textbox
  onLastNameChange = txtLastName => {
    this.setState({ customerLastName: txtLastName });
  };
  //Get Phone Number from textbox
  onPhoneNumberChange = txtPhoneNumber => {
    this.setState({ customerPhoneNUmber: txtPhoneNumber });
  };

  //Save Customer Form
  saveCustomerDetails = (email, firstNm, lastNm, phoneNum) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      // console.log("Email is Not Correct");
      this.setState({
        validateEmail: "Invalid Email",
        errorEmail: true
      });
      return false;
    } 
    // else if (isNaN(phoneNum) || phoneNum.length !== 10 || phoneNum == "") {
    //   Toast.showWithGravity("Invalid Phone Number", Toast.SHORT, Toast.CENTER);
    // } 
    else {
      this.setState({ validateEmail: "Email is Correct", errorEmail: false });
      // console.log("Email is Correct");
      this.setState({ loadSpinner: true });
      fetch(`${add_customerURL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        },
        body: JSON.stringify({
          Email: email,
          FirstName: firstNm,
          LastName: lastNm,
          DistributorID: this.state.distributorId,
          Phone: phoneNum,
          BillingAddress: this.state.customerStreet,
          BillingCity: this.state.customerCity,
          BillingState: "UT",
          BillingZip: this.state.customerZipCode
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          // console.log(responseJson);
          this.setState({
            customerData: responseJson
          });
          //console.log("Data", this.state.customerData);
          this.setState({ loadFormMessage: true, loadSpinner: false });
          if (this.state.customerData.Result !== "Failed") {
            //console.log("Success");
            this.setState({
              customerEmail: "",
              customerFirstName: "",
              customerLastName: "",
              customerPhoneNUmber: "",
              customerStreet: "",
              customerCity: "",
              customerState: "",
              customerZipCode: ""
            });
          } else {
            //console.log("Fail");
            this.setState({
              customerEmail: email,
              customerFirstName: firstNm,
              customerLastName: lastNm,
              customerPhoneNUmber: phoneNum,
              customerStreet: this.state.customerStreet,
              customerCity: this.state.customerCity,
              customerState: this.state.customerState,
              customerZipCode: this.state.customerZipCode
            });
          }
          setTimeout(() => {
            this.setState({ loadFormMessage: false });
          }, 3000);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  //Go to Profile Screen
  gotoProfile = () => {
    this.props.navigation.navigate("Profile");
  };
  //Go To Settings
  goToSettings = () => {
    this.props.navigation.navigate("SettingsScreen");
  };
  //Go To Help
  goToHelp = () => {
    this.props.navigation.navigate("HelpScreen");
  };
  goToSignout = () => {
    AsyncStorage.removeItem("LoginDetails");
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Customer")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Add Customer</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
            </Button>
            <TouchableHighlight style={commonStyles.ellipsBtnTouch}>
              <OptionsMenu
                customButton={
                  <Icon
                    name="ellipsis-v"
                    type="FontAwesome"
                    style={{ color: "#f2f2f2" }}
                  />
                }
                destructiveIndex={1}
                options={["Profile", "Settings", "Help", "Signout"]}
                actions={[
                  this.gotoProfile,
                  this.goToSettings,
                  this.goToHelp,
                  this.goToSignout
                ]}
              />
            </TouchableHighlight>
          </Right>
        </Header>
        <Content>
          <ScrollView>
            <View style={commonStyles.setMargin}>
              <Text style={commonStyles.setMargin}>Email</Text>
              <Item>
                <TextInput
                  style={{ flex: 1, color: "#413E4F" }}
                  onChangeText={this.onEmailChange}
                  value={this.state.customerEmail}
                  placeholderTextColor="#413E4F"
                  autoCapitalize="sentences"
                  selectTextOnFocus={true}
                  ref={ref => {
                    this._emailInput = ref;
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    this._firstNameInput && this._firstNameInput.focus()
                  }
                  blurOnSubmit={false}
                />
              </Item>
            </View>
            <View>
              {this.state.errorEmail && (
                <Label style={commonStyles.errorMsg}>
                  {this.state.validateEmail}
                </Label>
              )}
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              // keyboardVerticalOffset={65}
              behavior={"padding"}
              enabled
            >
              <View style={commonStyles.setMargin}>
                <Text style={commonStyles.setMargin}>First Name</Text>
                <Item>
                  <TextInput
                    style={{ flex: 1, color: "#413E4F" }}
                    onChangeText={this.onFirstNameChange}
                    value={this.state.customerFirstName}
                    placeholderTextColor="#413E4F"
                    autoCapitalize="sentences"
                    ref={ref => {
                      this._firstNameInput = ref;
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this._lastNameInput && this._lastNameInput.focus()
                    }
                    blurOnSubmit={false}
                  />
                </Item>
              </View>
              <View style={commonStyles.setMargin}>
                <Text style={commonStyles.setMargin}>Last Name</Text>
                <Item>
                  <TextInput
                    style={{ flex: 1, color: "#413E4F" }}
                    onChangeText={this.onLastNameChange}
                    value={this.state.customerLastName}
                    placeholderTextColor="#413E4F"
                    autoCapitalize="sentences"
                    ref={ref => {
                      this._lastNameInput = ref;
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this._phoneNumberInput && this._phoneNumberInput.focus()
                    }
                    blurOnSubmit={false}
                  />
                </Item>
              </View>
              <View style={commonStyles.setMargin}>
                <Text style={commonStyles.setMargin}>Phone Number</Text>
                <Item>
                  <TextInput
                    style={{ flex: 1, color: "#413E4F" }}
                    onChangeText={this.onPhoneNumberChange}
                    value={this.state.customerPhoneNUmber}
                    placeholderTextColor="#413E4F"
                    autoCapitalize="sentences"
                    keyboardType="numeric"
                    ref={ref => {
                      this._phoneNumberInput = ref;
                    }}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                  />
                </Item>
              </View>
              <View style={commonStyles.setMargin}>
                <Card>
                  <CardItem>
                    <Left>
                      <Label>Billing Address</Label>
                    </Left>
                    <Right>
                      <Switch
                        value={this.state.valBillingAddress}
                        onValueChange={this.onBillingAddressChange}
                      />
                    </Right>
                  </CardItem>
                </Card>
              </View>
              {this.state.valBillingAddress && (
                <View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Street</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={text =>
                          this.setState({ customerStreet: text })
                        }
                        value={this.state.customerStreet}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._streetInput = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._cityInput && this._cityInput.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>City</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={city =>
                          this.setState({ customerCity: city })
                        }
                        value={this.state.customerCity}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._cityInput = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._stateInput && this._stateInput.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>State</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={custState =>
                          this.setState({ customerState: custState })
                        }
                        value={this.state.customerState}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._stateInput = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._zipCodeInput && this._zipCodeInput.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Zip</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={zipCode =>
                          this.setState({ customerZipCode: zipCode })
                        }
                        value={this.state.customerZipCode}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._zipCodeInput = ref;
                        }}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                      />
                    </Item>
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>
            {this.state.loadSpinner && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {this.state.loadFormMessage && (
              <Label style={commonStyles.errorMsg}>
                {/* Incorrect credentials were supplied */}
                {/* {this.state.customerData.Message} */}
                {this.state.customerData.Result === "Success"
                  ? this.state.customerData.Result
                  : this.state.customerData.Message}
              </Label>
            )}
            <View style={commonStyles.buttonPos}>
              <Text
                style={{ color: "#42f4f1", fontSize: 20, fontWeight: "bold" }}
                onPress={() => {
                  this.saveCustomerDetails(
                    this.state.customerEmail,
                    this.state.customerFirstName,
                    this.state.customerLastName,
                    this.state.customerPhoneNUmber
                  );
                }}
              >
                Save
              </Text>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
