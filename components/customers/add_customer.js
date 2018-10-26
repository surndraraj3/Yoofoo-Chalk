import React from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  ActivityIndicator,
  AsyncStorage
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
import { add_customerURL } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class AddCutsomer extends React.Component {
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
      authToken:""
    };
  }
  //Get Distributor Id from sync storage
  componentDidMount = async () => {
    await AsyncStorage.getItem("LoginDetails")
      // .then(response => response.json())
      .then(responseJson => {
        responseJson = JSON.parse(responseJson);
        console.log(responseJson.message, responseJson.DistributorID);
        this.setState({ distributorId: responseJson.DistributorID, authToken: responseJson.Token });
      });
  };
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
    this.setState({ loadSpinner: true });
    fetch(`${add_customerURL}`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.authToken}`
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
        console.log("Data", this.state.customerData);
        this.setState({ loadFormMessage: true, loadSpinner: false });
        if (this.state.customerData.Result !== "Failure") {
          console.log("Success");
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
          console.log("Fail");
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
  };

  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
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
            <Button transparent>
              <Icon name="home" />
            </Button>
            <Button transparent>
              <Icon name="more" />
            </Button>
          </Right>
        </Header>
        <Content>
          <ScrollView>
            <Card>
              <CardItem>
                <Item stackedLabel>
                  <Label>Email</Label>
                  <Input
                    onChangeText={this.onEmailChange}
                    value={this.state.customerEmail}
                  />
                </Item>
              </CardItem>
              {this.state.errorEmail && (
                <Label style={commonStyles.errorMsg}>
                  {this.state.validateEmail}
                </Label>
              )}
              <CardItem>
                <Item stackedLabel>
                  <Label>First Name</Label>
                  <Input
                    onChangeText={this.onFirstNameChange}
                    value={this.state.customerFirstName}
                  />
                </Item>
              </CardItem>
              <CardItem>
                <Item stackedLabel>
                  <Label>Last Name</Label>
                  <Input
                    onChangeText={this.onLastNameChange}
                    value={this.state.customerLastName}
                  />
                </Item>
              </CardItem>
              <CardItem>
                <Item stackedLabel>
                  <Label>Phone Number</Label>
                  <Input
                    onChangeText={this.onPhoneNumberChange}
                    keyboardType="numeric"
                    maxLength={10}
                    value={this.state.customerPhoneNUmber}
                  />
                </Item>
              </CardItem>
            </Card>
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
                  {/* <Switch 
                    onValueChange={(this.state.valBillingAddress) ? this.setState({ valBillingAddress: true }) : this.setState({ valBillingAddress: false })}
                    value={this.state.valBillingAddress} 
                    />  */}
                </Right>
              </CardItem>
              {this.state.valBillingAddress && (
                <View>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>Street</Label>
                      <Input onChangeText={(text) => this.setState({ customerStreet: text})}/>
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>City</Label>
                      <Input onChangeText={(city) => this.setState({ customerCity: city })} />
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>State</Label>
                      <Input onChangeText={(custState) => this.setState({ customerState: custState })} />
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>Zip</Label>
                      <Input onChangeText={(zipCode) => this.setState({ customerZipCode: zipCode })} />
                    </Item>
                  </CardItem>
                </View>
              )}
            </Card>
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
