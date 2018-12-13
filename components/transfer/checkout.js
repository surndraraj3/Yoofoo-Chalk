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
  TouchableHighlight
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
      getDesignerObject: this.props.navigation.getParam("DesignerObJ")
    };
  }
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
        if(this.state.getDesignerObject !== undefined) {
          responseJson.push(this.state.getDesignerObject);
          console.log('CustId', this.state.getDesignerObject.CustomerID)          
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
  //save checkout orders
  saveOrderDtls = () => {
    //console.log('Cart', this.state.getOrdesFromCart);
    //console.log("resAddOrderJson", this.state.cashVal);
    if (this.state.getOrdesFromCart !== undefined) {
      this.state.getOrdesFromCart.map(itmVal => {
        //console.log("Before Quantity", itmVal.Quantity);
        itmVal.Quantity = itmVal.incVal;
        itmVal.Discount = itmVal.discountVal;
        itmVal.DesignerID = this.state.distributorId;
        //console.log("After Quantity", itmVal.Quantity);
      });
      //console.log("Final Composure Data", this.state.getOrdesFromCart);
      fetch(`${addOrdersUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        },
        body: JSON.stringify(this.state.getOrdesFromCart)
      })
        .then(response => response.json())
        .then(resAddOrderJson => {
          // console.log("resAddOrderJson", this.state.cashVal);

          if (resAddOrderJson.OrderID !== "0") {
            fetch(`${postCashPaymentUrl}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.state.authToken}`
              },
              body: JSON.stringify({
                CustomerID: this.state.selCustomerVal,
                OrderID: resAddOrderJson.OrderID,
                PaymentAmount: this.state.cashVal // - this.state.remainingDueVal
              })
            })
              .then(responseCashPayment => responseCashPayment.json())
              .then(resCashPaymentJson => {
                Toast.showWithGravity(
                  `Order placed successfully Order Id: ${
                    resAddOrderJson.OrderID
                  }`,
                  Toast.SHORT,
                  Toast.CENTER
                );
                this.setState({
                  getOrdesFromCart: [],
                  selCustomerVal: "",
                  customerId: ""
                });

                setTimeout(() => {
                  this.props.navigation.navigate("Home");
                }, 2000);
              });
          } else {
            Toast.showWithGravity(
              `Order Failed: ${resAddOrderJson.OrderID}`,
              Toast.SHORT,
              Toast.CENTER
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  //On Customer Change get value and map it across all orders
  handleOnChangeCustomersList = e => {
    console.log("OnChange", e);
    if (e !== "Select Customer") {
      this.setState({ customerId: e, selCustomerVal: e });
      //console.log('Order List Before', this.state.getOrdesFromCart);
      if (this.state.getOrdesFromCart !== undefined) {
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = e;
        });
        this.setState({ getOrdesFromCart: this.state.getOrdesFromCart });
        //console.log('Order List After', this.state.getOrdesFromCart);
        this.handleCalculateOrder();
      } else {
        console.log("Undefined Customer");
      }
    } else {
      console.log("Default Value");
    }
  };

  handleCalculateOrder = () => {
    console.log("No Customer", this.state.getPrevCustomerId);
    if (isNaN(this.state.getPrevCustomerId)) {
      //console.log("Get Customer Id", this.state.getPrevCustomerId);
      //this.setState({ selCustomerVal: "", customerId: "" });
    } else {
      
      if(this.state.getDesignerObject !== undefined) {
        this.setState({
          selCustomerVal: this.state.getDesignerObject.CustomerID,
          customerId: this.state.getDesignerObject.CustomerID
        });
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = this.state.getDesignerObject.CustomerID;
          dt.Price = dt.Price;
          dt.DesignerID = this.state.distributorId;
        });
        // console.log("-----Get Customer Id----", this.state.getDesignerObject.CustomerID);
      } else{
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
      // this.handleOnChangeCustomersList();
      //console.log('Before Cart Items', this.state.getOrdesFromCart);
      
     //console.log('Cart Items', this.state.getOrdesFromCart);
      //console.log("-----Get Customer Id----", this.state.getOrdesFromCart);
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
      //console.log("getCustId", getCustId);
      if (getCustId.length > 0) {
        //console.log("Add Customer Id", getCustId);
        Toast.showWithGravity(
          "No customer id found, Please add customer to place an order",
          Toast.SHORT,
          Toast.CENTER
        );
      } else {
        this.state.getOrdesFromCart.map(itmVal => {
          //console.log("Before Quantity", itmVal.Quantity);
          itmVal.Quantity = itmVal.incVal;
          itmVal.Discount = itmVal.discountVal;
          //console.log("After Quantity", itmVal.Quantity);
        });
        //console.log("Data Found", getCustId);
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
            //console.log("Orders");this.setState({  });
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
    //console.log("Customer Id", this.state.selCustomerVal);
    //console.log('-------------', this.state.customersListData);
    //console.log('Test Designer Obj', this.state.getDesignerObject);
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
                        {"\u0024"} {this.state.remainingDueVal}
                      </Text>
                    ) : (
                      <Text>
                        {"\u0024"} {this.state.remainingDueVal}
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
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={crdNum => {
                          this.setState({ cadrNumber: crdNum });
                        }}
                        value={this.state.cadrNumber}
                        placeholderTextColor="#413E4F"
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
                  </View>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={"position"}
                  enabled
                >
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Expiry Month</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={expMnth =>
                          this.setState({ expiryMonth: expMnth })
                        }
                        value={this.state.expiryMonth}
                        placeholderTextColor="#413E4F"
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
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>Expiry Year</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={expYr =>
                          this.setState({ expiryYear: expYr })
                        }
                        value={this.state.expiryYear}
                        placeholderTextColor="#413E4F"
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
                    </Item>
                  </View>
                  <View style={commonStyles.setMargin}>
                    <Text style={commonStyles.setMargin}>CVV</Text>
                    <Item>
                      <TextInput
                        style={{ flex: 1, color: "#413E4F" }}
                        onChangeText={cvvNum => {
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
                          this._areaZip && this._areaZip.focus()
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
                        onChangeText={areaZip => {
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
                  </View>
                </KeyboardAvoidingView>
                {/* <CardItem>
                  <Item regular>
                    <Input placeholder="Name On Card" />
                  </Item>
                </CardItem> */}
                {/* <CardItem>
                  <Item regular>
                    <Input
                      placeholder="Card Number"
                      value={this.state.cadrNumber}
                      onChange={crdNum => {
                        this.setState({ cadrNumber: crdNum });
                      }}
                    />
                  </Item>
                </CardItem> */}
                {/* <CardItem>
                  <Item regular>
                    <Input
                      placeholder="Expiry Month"
                      value={this.state.expiryMonth}
                      onChange={expMnth =>
                        this.setState({ expiryMonth: expMnth })
                      }
                    />
                  </Item>
                </CardItem> */}
                {/* <CardItem>
                  <Item regular>
                    <Input
                      placeholder="Expiry Year"
                      value={this.state.expiryYear}
                      onChange={expYr => this.setState({ expiryYear: expYr })}
                    />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input
                      placeholder="CVV"
                      value={this.state.cvvNumber}
                      onChange={cvvNum => {
                        this.setState({ cvvNumber: cvvNum });
                      }}
                    />
                  </Item>
                </CardItem> */}
                {/* <CardItem>
                  <Item regular>
                    <Input
                      placeholder="Zip"
                      value={this.state.areaZipCode}
                      onChange={areaZip => {
                        this.setState({ areaZipCode: areaZip });
                      }}
                    />
                  </Item>
                </CardItem> */}
              </Card>
              <View style={{ margin: 10 }}>
                <Button
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
                    Charge {"\u0024"} {this.state.cashVal}
                  </Text>
                </Button>
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
