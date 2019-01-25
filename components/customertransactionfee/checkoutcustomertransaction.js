import React from "react";
import {
  Text,
  TextInput,
  Keyboard,
  View,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
  Picker,
  KeyboardAvoidingView,
  TouchableHighlight,
  Alert
} from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title,
  Card,
  CardItem
} from "native-base";
import Toast from "react-native-simple-toast";
import OptionsMenu from "react-native-options-menu";
import commonStyles from "../styles/styles";
import {
  getCustomerListURL,
  calculateAddOrdersUrl,
  addOrdersUrl
} from "../common/url_config";

export default class CheckoutCustomerTransactionScreen extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      distributorId: "",
      authToken: "",
      msgData: "",
      customersListData: [],
      calculateOrdersData: [],
      selCustomerVal: "",
      customerId: "",
      cashVal: 0,
      remainingDueVal: 0,
      cashandTransactionFee: 0,
      cardName: "",
      cadrNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvvNumber: "",
      areaZipCode: "",
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingState: "",
      errCardNumber: "",
      errMsgExpiryMnth: "",
      errMsgExpiryYear: "",
      errMsgCvvNmbr: "",
      errMsgBillingAddress1: "",
      errMsgBillingCity: "",
      errMsgBillingState: "",
      errMsgBillingZipCode: "",
      btnCheckoutStatus: false,
      getPrevCustomerId: this.props.navigation.getParam("customerID"),
      cstmrTransactionFee:""
    };
  }
  //Get Logindetails of logged in user from localstorage and assign to state variable of distributorId & authToken
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails").then(responseJson => {
      responseJson = JSON.parse(responseJson);
      //console.log(responseJson.message, responseJson.DistributorID);
      if (this._isMounted) {
        this.setState({
          distributorId: responseJson.DistributorID,
          authToken: responseJson.Token
        });
      }
    });
    if (this._isMounted) this.loadCustomerDetails();
  };
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      distributorId: "",
      authToken: ""
    });
  }
  //Load List of customers by passing distributorid as a parameter
  //Assign data to customersListData of a state variable
  //If catches error make customersListData of a state variable as empty
  loadCustomerDetails = () => {
    this.setState({
      selCustomerVal: this.state.getPrevCustomerId,
      customerId: this.state.getPrevCustomerId
    });
    fetch(`${getCustomerListURL}${this.state.distributorId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          customersListData: responseJson
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ customersListData: [] });
        this.setState({ loading: false });
      });
  };
  //check total field - cashvalue is > 0 validate the form fields
  //If all fields are filled save the form data
  validateCheckoutOrderDtls = () => {
    this.setState({ loading: true });
    // console.log("Remaining Due Val", this.state.remainingDueVal);
    if (this.state.calculateOrdersData.totalField - this.state.cashVal > 0) {
      if (this.state.cadrNumber === "") {
        this.setState({ errCardNumber: "Please enter card number" });
        this.setState({ loading: false });
      } else if (this.state.expiryMonth === "") {
        this.setState({ errMsgExpiryMnth: "Please enter expiry month" });
        this.setState({ loading: false });
      } else if (this.state.expiryYear === "") {
        this.setState({ errMsgExpiryYear: "Please enter expiry year" });
        this.setState({ loading: false });
      } else if (this.state.cvvNumber === "") {
        this.setState({ errMsgCvvNmbr: "Please enter cvv" });
        this.setState({ loading: false });
      } else if (this.state.billingAddress1 === "") {
        this.setState({ errMsgBillingAddress1: "Please enter address1" });
        this.setState({ loading: false });
      } else if (this.state.billingCity === "") {
        this.setState({ errMsgBillingCity: "Please enter city" });
        this.setState({ loading: false });
      } else if (this.state.areaZipCode === "") {
        this.setState({ errMsgBillingZipCode: "Please enter zip" });
        this.setState({ loading: false });
      } else {
        this.saveOrderDtls();
        // console.log('Save');
      }
    } else {
      this.saveOrderDtls();
      // console.log('Save')
    }
  };

  // Validate form fields on text change
  handleValidateBillingDtls = (txt, type) => {
    //console.log("Address Dteails", txt, type);
    if (type === "address1") {
      if (txt.length >= 128) {
        this.setState({
          errMsgBillingAddress1: "The text can not exceed 128 characters long"
        });
        //console.log("Length Exceeds", this.state.errMsgBillingAddress1);
      } else {
        this.setState({
          errMsgBillingAddress1: ""
        });
      }
    }
    if (type === "city") {
      if (txt.length > 0) {
        this.setState({
          errMsgBillingCity: ""
        });
        //console.log("Length Exceeds", this.state.errMsgBillingAddress1);
      } else {
        this.setState({
          errMsgBillingCity: "Please enter city"
        });
      }
    }
    //zipcode
    if (type === "zipcode") {
      if (txt.length > 0) {
        this.setState({
          errMsgBillingZipCode: ""
        });
      } else {
        this.setState({
          errMsgBillingZipCode: "Please enter zip"
        });
      }
    }
    //Validate Card Number
    if (type === "cardnumber") {
      if (txt.length > 0) {
        this.setState({
          errCardNumber: ""
        });
      } else {
        this.setState({
          errCardNumber: "Please enter card number"
        });
      }
    }
    //Validate ExpiryMonth
    if (type === "typeExpiryMonth") {
      if (txt.length > 0) {
        this.setState({
          errMsgExpiryMnth: ""
        });
      } else {
        this.setState({
          errMsgExpiryMnth: "Please enter expiry month"
        });
      }
    }
    //Validate Expiry Year
    if (type === "typeExpiryYear") {
      if (txt.length > 0) {
        this.setState({
          errMsgExpiryYear: ""
        });
      } else {
        this.setState({
          errMsgExpiryYear: "Please enter expiry year"
        });
      }
    }
    // Validate CVV Number
    if (type === "typeCvvNumber") {
      if (txt.length > 0) {
        this.setState({
          errMsgCvvNmbr: ""
        });
      } else {
        this.setState({
          errMsgCvvNmbr: "Please enter cvv"
        });
      }
    }
  };

  //Calculate order details by posting JSON
  //Response from the post data and assign to state variable calculateOrdersData
  calculateOrderDtls = valCtFld => {
    const jsonOrder = [
      {
        OrderDate: "",
        ShipMethod: "",
        PriceType: "",
        OrderTYpe: 3,
        OrderID: "0",
        DesignerID: this.state.distributorId,
        CustomerID: this.state.customerId,
        ItemID: "CTF",
        Description: "Create and Take Fee",
        Quantity: 1,
        Discount: 0,
        DiscountType: "",
        Price: valCtFld,
        DiscountedPrice: 0.0,
        CashPaymentAmount: 0.0,
        CreditPaymentAmount: 0.0,
        CreditCardNumber: null,
        CVV: null,
        ExpMonth: null,
        ExpYear: null
      }
    ];

    fetch(`${calculateAddOrdersUrl}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      },
      body: JSON.stringify(jsonOrder)
    })
      .then(respOrderDtls => respOrderDtls.json())
      .then(respCalOrderJson => {
        //console.log("Orders", respCalOrderJson);
        this.setState({
          calculateOrdersData: respCalOrderJson,
          loading: false
        });
      })
      .catch(errCalOrder => {
        throw errCalOrder;
      });
  };

  // Save Form data based fileds data entered by user
  //Post data to the server and capture the response and show it on user screen
  saveOrderDtls = () => {
    const creditVal = (
      this.state.calculateOrdersData.totalField - this.state.cashVal
    ).toFixed(2);
    const postJsonForm = {
      paymentDetail: {
        CustomerID: this.state.customerId,
        DesignerID: this.state.distributorId,
        OrderID: "",
        CashPaymentAmount: this.state.cashVal,
        CreditPaymentAmount: creditVal,
        CreditCardNumber: this.state.cadrNumber,
        CVV: this.state.cvvNumber,
        ExpMonth: this.state.expiryMonth,
        ExpYear: this.state.expiryYear,
        CustomerFirstName: this.state.cardName,
        CustomerLastName: this.state.cardName,
        Address1: this.state.billingAddress1,
        Address2: this.state.billingAddress2,
        City: this.state.billingCity,
        State: this.state.billingState,
        Zip: this.state.areaZipCode
      },
      OrderDetail: [
        {
          Description: "Create and Take Fee ",
          ItemID: "CTF",
          Quantity: 1,
          Discount: null,
          DiscountType: "",
          Price: this.state.cstmrTransactionFee,
          DiscountedPrice: 0.0
        }
      ]
    };
    fetch(`${addOrdersUrl}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      },
      body: JSON.stringify(postJsonForm)
    })
      .then(responseAddOrder => responseAddOrder.json())
      .then(resAddOrderJson => {
        //resAddOrderJson.OrderID !== 0
        if (
          resAddOrderJson.OrderID === null ||
          resAddOrderJson.OrderID === "null"
        ) {
          console.log("resAddOrderJson-----", resAddOrderJson.OrderID);

          Toast.showWithGravity(
            `Order Failed: ${resAddOrderJson.message}`,
            Toast.SHORT,
            Toast.CENTER
          );
          this.setState({ loading: false });
        } else {
          //console.log("resAddOrderJson Failed", resAddOrderJson.OrderID);
          Alert.alert(
            "Orders",
            `Order placed successfully Order Id: ${resAddOrderJson.OrderID}`,
            [
              {
                text: "OK",
                onPress: () => {
                  if (resAddOrderJson.OrderID !== undefined) {
                    setTimeout(() => {
                      this.props.navigation.navigate("Home");
                    }, 2000);
                  }
                }
              }
            ],
            { cancelable: false }
          );
          this.setState({
            calculateOrdersData: [],
            selCustomerVal: "",
            customerId: ""
          });
          this.setState({ loading: false });
        }
      });
  };

  //Load Indicator icon on intial screen load
  renderLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
            // backgroundColor: 'red',
            // opacity: 0.3
          }}
        />
      );
    } else {
      return null;
    }
  }
  //--------------------------------------------------------------
  //Page top right corner menu icon action events
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
  //---------------------------------------------------------------

  render() {   
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Checkout</Title>
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
          <View>
            <ScrollView>
              <View style={{ flexDirection: "row" }}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.selCustomerVal}
                  style={{ height: 50, width: "100%" }}                 
                  onValueChange={(itemValue, itemIndex) => {                    
                    this.setState({
                      customerId: itemValue,
                      selCustomerVal: itemValue
                    });
                  }}
                >
                  <Picker.Item
                    label="Select Customer"
                    value="Select Customer"
                  />
                  {this.state.customersListData.map((dt, i) => {
                    return (
                      <Picker.Item
                        label={dt.FirstName}
                        value={dt.CustomerID}
                        key={i}
                      />
                    );
                  })}
                </Picker>
              </View>
              <Card>
                <CardItem>
                  <Left>
                    <Text>Sub Total</Text>
                  </Left>
                  <Right>
                    {this.state.calculateOrdersData.subTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.calculateOrdersData.subTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                    {/* <Text>{"\u0024"} 0</Text> */}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Total Discounts</Text>
                  </Left>
                  <Right>
                    {this.state.calculateOrdersData.discountTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.calculateOrdersData.discountTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                    {/* <Text>{"\u0024"} 0</Text> */}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Sales Tax</Text>
                  </Left>
                  <Right>
                    <Text>
                      {"\u0024"} {this.state.calculateOrdersData.taxTotalField}
                      {/* <Text>{"\u0024"} 0</Text> */}
                    </Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Shipping</Text>
                  </Left>
                  <Right>
                    {this.state.calculateOrdersData.shippingTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.calculateOrdersData.shippingTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                    {/* <Text>{"\u0024"} 0</Text> */}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>C & T Fee</Text>
                  </Left>
                  <Right>
                    <Item>
                      <Input
                        autoCapitalize="sentences"
                        value={this.state.cashandTransactionFee}
                        onChangeText={txtCTFld => {
                          this.setState({
                            cstmrTransactionFee: txtCTFld
                          });
                          this.calculateOrderDtls(txtCTFld);
                        }}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        autoCapitalize="sentences"
                        placeholder="Enter C & T Fee"
                        style={{ textAlign: "right" }}
                      />
                    </Item>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Order Total</Text>
                  </Left>
                  <Right>
                    {this.state.calculateOrdersData.totalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.calculateOrdersData.totalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                    {/* <Text>{"\u0024"} 0</Text> */}
                  </Right>
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Left>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40 / 2,
                        backgroundColor: "#ffffff",
                        borderColor: "black",
                        borderWidth: 1
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                          margin: 5,
                          fontWeight: "bold"
                        }}
                      >
                        {"\u0024"}
                      </Text>
                    </View>
                    <Text style={{ margin: 5 }}> Cash </Text>
                  </Left>
                  <Right>
                    <Item>
                      {/* <Text> {"\u0024"}</Text> */}
                      <Input
                        autoCapitalize="sentences"
                        value={this.state.cashVal}
                        onChangeText={txtCashVal => {
                          this.setState({
                            cashVal: txtCashVal,
                            remainingDueVal:
                              this.state.calculateOrdersData.totalField -
                              txtCashVal
                          });
                        }}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        autoCapitalize="sentences"
                        placeholder="Enter Cash"
                        style={{ textAlign: "right" }}
                      />
                    </Item>
                  </Right>
                </CardItem>
              </Card>
              <Card>
                <CardItem header>
                  <Icon name="credit-card" type="FontAwesome" />
                  <Text>Credit Card</Text>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Remaining Due</Text>
                  </Left>
                  <Right>
                    {isNaN(this.state.remainingDueVal) > 0 ? (
                      <Text>
                        {"\u0024"}
                        {(
                          this.state.calculateOrdersData.totalField -
                          this.state.cashVal
                        ).toFixed(2)}
                      </Text>
                    ) : (
                      <Text>
                        {"\u0024"}
                        {(
                          this.state.calculateOrdersData.totalField -
                          this.state.cashVal
                        ).toFixed(2)}
                      </Text>
                    )}
                  </Right>
                </CardItem>
                <KeyboardAvoidingView
                  // style={{ flex: 1 }}
                  // behavior={"padding"}
                  enabled
                >
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Name On Card</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={crdNm => {
                          this.setState({ cardName: crdNm });
                          //console.log("CrdNm", crdNm);
                        }}
                        value={this.state.cardName}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._cardName = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._cadrNumber && this._cadrNumber.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Card Number</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1 }}
                        onChangeText={crdNum => {
                          this.handleValidateBillingDtls(crdNum, "cardnumber");
                          this.setState({ cadrNumber: crdNum });
                        }}
                        value={this.state.cadrNumber}
                        // placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._cadrNumber = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._expiryMonth && this._expiryMonth.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                    {this.state.errCardNumber !== "" ? (
                      <Text style={commonStyles.warningMessage}>
                        {this.state.errCardNumber}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView enabled>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly"
                    }}
                  >
                    <View style={commonStyles.setMargin}>
                      <Text style={commonStyles.setMargin}>Expiry Month</Text>
                      <TextInput
                        style={{
                          flex: 1,
                          color: "#413E4F",
                          borderWidth: 1,
                          width: 80,
                          height: 30
                        }}
                        onChangeText={expMnth => {
                          this.handleValidateBillingDtls(
                            expMnth,
                            "typeExpiryMonth"
                          );
                          this.setState({ expiryMonth: expMnth });
                        }}
                        value={this.state.expiryMonth}
                        placeholderTextColor="#413E4F"
                        placeholder="mm"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._expiryMonth = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._expiryYear && this._expiryYear.focus()
                        }
                        blurOnSubmit={false}
                      />
                      {this.state.errMsgExpiryMnth !== "" ? (
                        <Text style={commonStyles.warningMessage}>
                          {this.state.errMsgExpiryMnth}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                    <View style={commonStyles.setMargin}>
                      <Text style={commonStyles.setMargin}>Expiry Year</Text>

                      <TextInput
                        style={{
                          flex: 1,
                          color: "#413E4F",
                          borderWidth: 1,
                          width: 80,
                          height: 30
                        }}
                        onChangeText={expYr => {
                          this.handleValidateBillingDtls(
                            expYr,
                            "typeExpiryYear"
                          );
                          this.setState({ expiryYear: expYr });
                        }}
                        value={this.state.expiryYear}
                        placeholderTextColor="#413E4F"
                        placeholder="YYYY"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._expiryYear = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._cvvNum && this._cvvNum.focus()
                        }
                        blurOnSubmit={false}
                      />
                      {this.state.errMsgExpiryYear !== "" ? (
                        <Text style={commonStyles.warningMessage}>
                          {this.state.errMsgExpiryYear}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={"padding"}
                  enabled
                >
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>CVV</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={cvvNum => {
                          this.handleValidateBillingDtls(
                            cvvNum,
                            "typeCvvNumber"
                          );
                          this.setState({ cvvNumber: cvvNum });
                        }}
                        value={this.state.cvvNumber}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._cvvNum = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._address1 && this._address1.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                    {this.state.errMsgCvvNmbr !== "" ? (
                      <Text style={commonStyles.warningMessage}>
                        {this.state.errMsgCvvNmbr}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Address1</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        value={this.state.billingAddress1}
                        onChangeText={bllngAddress1 => {
                          this.handleValidateBillingDtls(
                            bllngAddress1,
                            "address1"
                          );
                          this.setState({ billingAddress1: bllngAddress1 });
                        }}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._address1 = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._address2 && this._address2.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                    {this.state.errMsgBillingAddress1 !== "" ? (
                      <Text style={commonStyles.warningMessage}>
                        {this.state.errMsgBillingAddress1}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Address2</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={bllngAddress2 => {
                          this.setState({ billingAddress2: bllngAddress2 });
                        }}
                        value={this.state.billingAddress2}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._address2 = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._cityName && this._cityName.focus()
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
                        onChangeText={bllngCity => {
                          this.handleValidateBillingDtls(bllngCity, "city");
                          this.setState({ billingCity: bllngCity });
                        }}
                        value={this.state.billingCity}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        ref={ref => {
                          this._cityName = ref;
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this._stateName && this._stateName.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </Item>
                    {this.state.errMsgBillingCity !== "" ? (
                      <Text style={commonStyles.warningMessage}>
                        {this.state.errMsgBillingCity}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>State</Text>
                    <Item>
                      <Picker
                        mode="dialog"
                        selectedValue={this.state.billingState}
                        style={{ height: 50, width: "100%" }}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ billingState: itemValue })
                        }
                      >
                        <Picker.Item
                          label="select state"
                          value="select state"
                        />
                        <Picker.Item label="AL" value="AL" />
                        <Picker.Item label="AK" value="AK" />
                        <Picker.Item label="AZ" value="AZ" />
                        <Picker.Item label="AR" value="AR" />
                        <Picker.Item label="CA" value="CA" />
                        <Picker.Item label="CO" value="CO" />
                        <Picker.Item label="CT" value="CT" />
                        <Picker.Item label="DE" value="DE" />
                        <Picker.Item label="DC" value="DC" />
                        <Picker.Item label="FL" value="FL" />
                        <Picker.Item label="GA" value="GA" />
                        <Picker.Item label="HI" value="HI" />
                        <Picker.Item label="ID" value="ID" />
                        <Picker.Item label="IL" value="IL" />
                        <Picker.Item label="IN" value="IN" />
                        <Picker.Item label="IA" value="IA" />
                        <Picker.Item label="KS" value="KS" />
                        <Picker.Item label="KY" value="KY" />
                        <Picker.Item label="LA" value="LA" />
                        <Picker.Item label="ME" value="ME" />
                        <Picker.Item label="MD" value="MD" />
                        <Picker.Item label="MA" value="MA" />
                        <Picker.Item label="MI" value="MI" />
                        <Picker.Item label="MN" value="MN" />
                        <Picker.Item label="MS" value="MS" />
                        <Picker.Item label="MO" value="MO" />
                        <Picker.Item label="MT" value="MT" />
                        <Picker.Item label="NE" value="NE" />
                        <Picker.Item label="NV" value="NV" />
                        <Picker.Item label="NH" value="NH" />
                        <Picker.Item label="NJ" value="NJ" />
                        <Picker.Item label="NM" value="NM" />
                        <Picker.Item label="NY" value="NY" />
                        <Picker.Item label="NC" value="NC" />
                        <Picker.Item label="ND" value="ND" />
                        <Picker.Item label="OH" value="OH" />
                        <Picker.Item label="OK" value="OK" />
                        <Picker.Item label="OR" value="OR" />
                        <Picker.Item label="PA" value="PA" />
                        <Picker.Item label="RI" value="RI" />
                        <Picker.Item label="SC" value="SC" />
                        <Picker.Item label="SD" value="SD" />
                        <Picker.Item label="TN" value="TN" />
                        <Picker.Item label="TX" value="TX" />
                        <Picker.Item label="UT" value="UT" />
                        <Picker.Item label="VT" value="VT" />
                        <Picker.Item label="VA" value="VA" />
                        <Picker.Item label="WA" value="WA" />
                        <Picker.Item label="WV" value="WV" />
                        <Picker.Item label="WI" value="WI" />
                        <Picker.Item label="WY" value="WY" />
                      </Picker>
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Zip</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={areaZip => {
                          this.handleValidateBillingDtls(areaZip, "zipcode");
                          this.setState({ areaZipCode: areaZip });
                        }}
                        value={this.state.areaZipCode}
                        placeholderTextColor="#413E4F"
                        autoCapitalize="sentences"
                        keyboardType="numeric"
                        ref={ref => {
                          this._areaZip = ref;
                        }}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                      />
                    </Item>
                    {this.state.errMsgBillingZipCode !== "" ? (
                      <Text style={commonStyles.warningMessage}>
                        {this.state.errMsgBillingZipCode}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                </KeyboardAvoidingView>
              </Card>
              <View style={{ margin: 10 }}>
                {this.state.calculateOrdersData.totalField -
                  this.state.cashVal >
                0 ? (
                  <Button
                    full
                    style={{ backgroundColor: "#61d0c8" }}
                    onPress={this.validateCheckoutOrderDtls}
                    disabled={this.state.btnCheckoutStatus}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 20,
                        fontWeight: "bold"
                      }}
                    >
                      Charge {"\u0024"}
                      {(
                        this.state.calculateOrdersData.totalField -
                        this.state.cashVal
                      ).toFixed(2)}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    full
                    style={{ backgroundColor: "#61d0c8" }}
                    onPress={this.validateCheckoutOrderDtls}
                    disabled={this.state.btnCheckoutStatus}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 20,
                        fontWeight: "bold"
                      }}
                    >
                      Complete Order
                    </Text>
                  </Button>
                )}
              </View>
            </ScrollView>
          </View>
        </Content>
        {this.renderLoading()}
      </Container>
    );
  }
}
