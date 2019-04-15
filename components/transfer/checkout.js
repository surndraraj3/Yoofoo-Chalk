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
import {
  addOrdersUrl,
  getCustomerListURL,
  calculateAddOrdersUrl,
  postCashPaymentUrl,
  payCreditCardUrl
} from "../common/url_config";
import OptionsMenu from "react-native-options-menu";
import commonStyles from "../styles/styles";

export default class Checkout extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      distributorId: "",
      authToken: "",
      getOrdesFromCart: this.props.navigation.getParam("orderDtlsList"),
      getCalculatedOrders: [],
      msgData: "",
      selCustomerVal: "",
      customerId: "",
      customersListData: [],
      getPrevCustomerId: this.props.navigation.getParam("CustomerId"),
      cashVal: 0,
      remainingDueVal: 0,
      cardName: "",
      cadrNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvvNumber: "",
      areaZipCode: "",
      getDesignerObject: this.props.navigation.getParam("DesignerObJ"),
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
      btnCheckoutStatus: false
    };
  }
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails").then(responseJson => {
      responseJson = JSON.parse(responseJson);
      if (this._isMounted) {
        this.setState({
          distributorId: responseJson.DistributorID,
          authToken: responseJson.Token
        });
      }
    });
    if (this._isMounted) this.loadCheckoutDetails();
  };
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      customersListData: [],
      distributorId: "",
      authToken: ""
    });
  }
  //Load Checkout Details
  loadCheckoutDetails = () => {
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
        if (this.state.getDesignerObject !== undefined) {
          responseJson.push(this.state.getDesignerObject);
        }
        this.setState({
          customersListData: responseJson
        });
        this.handleCalculateOrder();
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ customersListData: [] });
        this.setState({ loading: false });
      });
  };
  //save checkout Validated orders
  saveOrderValidatedDtls = () => {
    if (this.state.getOrdesFromCart !== undefined) {
      let payloadData = [];
      this.state.getOrdesFromCart.map(itmVal => {
        itmVal.Quantity = itmVal.incVal;
        itmVal.Discount = itmVal.discountVal;
        itmVal.DesignerID = this.state.distributorId;
        const objPay = {
          CTE: false,
          Description: itmVal.Description,
          ItemID: itmVal.ItemID,
          Quantity: itmVal.Quantity,
          Discount: itmVal.Discount,
          DiscountType: itmVal.discountType,
          Price: itmVal.Price,
          DiscountedPrice: 0.0
        };
        payloadData.push(objPay);
      });

      const creditVal = (
        this.state.getCalculatedOrders.totalField - this.state.cashVal
      ).toFixed(2);

      fetch(`${addOrdersUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        },
        body: JSON.stringify({
          paymentDetail: {
            CustomerID: this.state.selCustomerVal,
            DesignerID: this.state.distributorId,
            OrderID: "",
            CustomerFirstName: this.state.cardName,
            CustomerLastName: this.state.cardName,
            Address1: this.state.billingAddress1,
            Address2: this.state.billingAddress2,
            City: this.state.billingCity,
            State: this.state.billingState,
            Zip: this.state.areaZipCode,
            CashPaymentAmount: this.state.cashVal,
            CreditPaymentAmount: creditVal,
            CreditCardNumber: this.state.cadrNumber,
            CVV: this.state.cvvNumber,
            ExpMonth: this.state.expiryMonth,
            ExpYear: this.state.expiryYear
          },
          OrderDetail: payloadData
        })
      })
        .then(response => response.json())
        .then(resAddOrderJson => {
          if (
            resAddOrderJson.OrderID === null ||
            resAddOrderJson.OrderID === "null"
          ) {
            this.setState({ btnCheckoutStatus: true });
            Toast.showWithGravity(
              `Order Failed: ${resAddOrderJson.message}`,
              Toast.SHORT,
              Toast.CENTER
            );
            this.setState({ loading: false });
          } else {
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
              getOrdesFromCart: [],
              selCustomerVal: "",
              customerId: ""
            });
            this.setState({ loading: false });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  //save checkout orders
  saveOrderDtls = () => {
    this.setState({ loading: true });
    if (this.state.getCalculatedOrders.totalField - this.state.cashVal > 0) {
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
        this.saveOrderValidatedDtls();
      }
    } else {
      this.saveOrderValidatedDtls();
    }
  };
  //On Customer Change get value and map it across all orders
  handleOnChangeCustomersList = e => {
    if (e !== "Select Customer") {
      this.setState({ customerId: e, selCustomerVal: e });
      if (this.state.getOrdesFromCart !== undefined) {
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = e;
        });
        this.setState({ getOrdesFromCart: this.state.getOrdesFromCart });
        this.handleCalculateOrder();
      } else {
        console.log("Undefined Customer");
      }
    } else {
      console.log("Default Value");
      this.setState({ customerId: e, selCustomerVal: e });
    }
  };

  handleCalculateOrder = () => {
    if (isNaN(this.state.getPrevCustomerId)) {
      //console.log("Get Customer Id", this.state.getPrevCustomerId);
      //this.setState({ selCustomerVal: "", customerId: "" });
    } else {
      if (this.state.getDesignerObject !== undefined) {
        this.setState({
          selCustomerVal: this.state.getDesignerObject.CustomerID,
          customerId: this.state.getDesignerObject.CustomerID
        });
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = this.state.getDesignerObject.CustomerID;
          dt.Price = dt.Price;
          dt.DesignerID = this.state.distributorId;
        });
      } else {
        this.setState({
          selCustomerVal: this.state.getPrevCustomerId,
          customerId: this.state.getPrevCustomerId
        });
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = this.state.getPrevCustomerId;
          dt.Price = dt.RetailPrice;
          dt.DesignerID = this.state.distributorId;
        });
      }
    }

    if (
      this.state.getOrdesFromCart === undefined ||
      this.state.getOrdesFromCart === null
    ) {
      Toast.showWithGravity(
        "No orders added to cart",
        Toast.SHORT,
        Toast.CENTER
      );
    } else {
      const getCustId = this.state.getOrdesFromCart.filter(
        dt => dt.CustomerID === "CUSTOMER-ID"
      );
      if (getCustId.length > 0) {
        Toast.showWithGravity(
          "No customer id found, Please add customer to place an order",
          Toast.SHORT,
          Toast.CENTER
        );
      } else {
        this.state.getOrdesFromCart.map(itmVal => {
          itmVal.Quantity = itmVal.incVal;
          itmVal.Discount = itmVal.discountVal;
        });
        fetch(`${calculateAddOrdersUrl}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.state.authToken}`
          },
          body: JSON.stringify(this.state.getOrdesFromCart)
        })
          .then(respCalOrder => respCalOrder.json())
          .then(respCalOrderJson => {
            this.setState({
              getCalculatedOrders: respCalOrderJson,
              loading: false
            });
          })
          .catch(errCalOrder => {
            throw errCalOrder;
          });
      }
    }
  };
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
  // Validate billing address fields
  handleValidateBillingDtls = (txt, type) => {
    if (type === "address1") {
      if (txt.length >= 128) {
        this.setState({
          errMsgBillingAddress1: "The text can not exceed 128 characters long"
        });
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
  //--------------------------------------------------------------
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
                  onValueChange={this.handleOnChangeCustomersList}
                  // onValueChange={(itemValue, itemIndex) => {
                  //   this.setState({ language: itemValue , customerId: itemValue});
                  //   // this.state.getOrdesFromCart.map(dt => {
                  //   //   dt.CustomerID = itemValue;
                  //   // });
                  // }}
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
                    {this.state.getCalculatedOrders.subTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.getCalculatedOrders.subTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Total Discounts</Text>
                  </Left>
                  <Right>
                    {this.state.getCalculatedOrders.discountTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.getCalculatedOrders.discountTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Sales Tax</Text>
                  </Left>
                  <Right>
                    <Text>
                      {"\u0024"} {this.state.getCalculatedOrders.taxTotalField}
                    </Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Shipping</Text>
                  </Left>
                  <Right>
                    {this.state.getCalculatedOrders.shippingTotalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.getCalculatedOrders.shippingTotalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>C & T Fee</Text>
                  </Left>
                  <Right>
                    <Text>{"\u0024"} 0.00</Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Order Total</Text>
                  </Left>
                  <Right>
                    {this.state.getCalculatedOrders.totalField ? (
                      <Text>
                        {"\u0024"}
                        {this.state.getCalculatedOrders.totalField}
                      </Text>
                    ) : (
                      <Text>{"\u0024"} 0</Text>
                    )}
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
                              this.state.getCalculatedOrders.totalField -
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
                          this.state.getCalculatedOrders.totalField -
                          this.state.cashVal
                        ).toFixed(2)}
                      </Text>
                    ) : (
                      <Text>
                        {"\u0024"}
                        {(
                          this.state.getCalculatedOrders.totalField -
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
                {this.state.getCalculatedOrders.totalField -
                  this.state.cashVal >
                0 ? (
                  <Button
                    full
                    style={{ backgroundColor: "#61d0c8" }}
                    onPress={this.saveOrderDtls}
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
                        this.state.getCalculatedOrders.totalField -
                        this.state.cashVal
                      ).toFixed(2)}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    full
                    style={{ backgroundColor: "#61d0c8" }}
                    onPress={this.saveOrderDtls}
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
                {/* <Button
                  full
                  style={{ backgroundColor: "#00ffff" }}
                  onPress={this.saveOrderDtls}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 20,
                      fontWeight: "bold"
                    }}
                  >
                    Charge {"\u0024"}{" "}
                    {this.state.getCalculatedOrders.totalField -
                      this.state.cashVal}
                      -
                      {this.state.getCalculatedOrders.totalField} - {this.state.cashVal}
                  </Text>
                </Button> */}
              </View>
            </ScrollView>
          </View>
        </Content>
        {this.renderLoading()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF",
    marginTop: 8
  },
  infoText: {
    textAlign: "center"
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center"
  },
  directorText: {
    color: "grey",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center"
  },
  openingText: {
    textAlign: "center"
  }
});
