import React from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Picker
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
  Title,
  Card,
  CardItem
} from "native-base";
import Toast from "react-native-simple-toast";
import {
  addOrdersUrl,
  getCustomerListURL,
  calculateAddOrdersUrl
} from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Checkout extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      distributorId: "",
      authToken: "",
      getOrdesFromCart: this.props.navigation.getParam("orderDtlsList"),
      getCalculatedOrders: [],
      msgData: "",
      selCustomerVal: "",
      customerId: "",
      customersListData: [],
      getPrevCustomerId: this.props.navigation.getParam("CustomerId")
    };
  }
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails").then(responseJson => {
      responseJson = JSON.parse(responseJson);
      //console.log(responseJson.message, responseJson.DistributorID);
      if(this._isMounted) {
        this.setState({
          distributorId: responseJson.DistributorID,
          authToken: responseJson.Token
        });
      }      
    });
    if(this._isMounted) this.loadCheckoutDetails();
  };
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      customersListData: [],
      distributorId: "",
      authToken: "",
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
        // console.log(responseJson);
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
    this.state.getOrdesFromCart.map(itmVal => {
      //console.log("Before Quantity", itmVal.Quantity);
      itmVal.Quantity = itmVal.incVal;
      itmVal.Discount = itmVal.discountVal;
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
        //console.log("resAddOrderJson", resAddOrderJson);
        const resMessage = `Order placed successfully Order Id: ${
          resAddOrderJson.OrderID
        }`;
        Toast.showWithGravity(
          `Order placed successfully Order Id: ${resAddOrderJson.OrderID}`,
          Toast.SHORT,
          Toast.CENTER
        );
        this.setState({ msgData: resMessage, getOrdesFromCart: [] });
        setTimeout(() => {
          this.props.navigation.navigate("Home");
        }, 2000);
      })
      .catch(error => {
        console.error(error);
      });
  };
  //On Customer Change get value and map it across all orders
  handleOnChangeCustomersList = e => {
    //console.log("OnChange", e);
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
    //console.log("Welcome Calculate", this.state.getPrevCustomerId);
    if(this.state.getPrevCustomerId === 'CUSTOMER-ID') {
      console.log('Get Customer Id');
    }
    {
      (this.state.getPrevCustomerId === undefined || this.state.getPrevCustomerId === 'CUSTOMER-ID')
        ? this.setState({
            selCustomerVal: "",
            customerId: ""
          })
        : this.setState({
            selCustomerVal: this.state.getPrevCustomerId,
            customerId: this.state.getPrevCustomerId
          });
    }
    // this.setState({
    //   selCustomerVal: this.state.getPrevCustomerId,
    //   customerId: this.state.getPrevCustomerId
    // });
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
            console.log("Orders");
            this.setState({ getCalculatedOrders: respCalOrderJson });
          })
          .catch(errCalOrder => {
            throw errCalOrder;
          });
      }
    }
  };
  render() {
    //console.log("Customer Id", this.state.selCustomerVal);
    //console.log('Cal', this.state.getCalculatedOrders);
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
            <Button transparent>
              <Icon name="more" />
            </Button>
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
                    <Text>{"\u0024"} 0.51</Text>
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
                    <Text>{"\u0024"} 9.50</Text>
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
                    <Text> {"\u0024"} 0.00</Text>
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
                    <Text>{"\u0024"} 0.00</Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input placeholder="Name On Card" />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input placeholder="Card Number" />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input placeholder="Exp. dd/mm" />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input placeholder="CVV" />
                  </Item>
                </CardItem>
                <CardItem>
                  <Item regular>
                    <Input placeholder="Zip" />
                  </Item>
                </CardItem>
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
                    Charge {"\u0024"} 8.99
                  </Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        </Content>
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
