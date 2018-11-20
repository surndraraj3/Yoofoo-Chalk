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
import { addOrdersUrl, getCustomerListURL } from "../common/url_config";
import Autocomplete from "react-native-autocomplete-input";
import commonStyles from "../styles/styles";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distributorId: "",
      authToken: "",
      getOrdesFromCart: this.props.navigation.getParam("orderDtlsList"),
      msgData: "",      
      selCustomerVal: "",
      customerId: "",
      customersListData: []
    };
  }
  componentDidMount = async () => {
    await AsyncStorage.getItem("LoginDetails").then(responseJson => {
      responseJson = JSON.parse(responseJson);
      console.log(responseJson.message, responseJson.DistributorID);
      this.setState({
        distributorId: responseJson.DistributorID,
        authToken: responseJson.Token
      });
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
        // console.log(responseJson);
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
  
  //save checkout orders
  saveOrderDtls = () => {
    this.state.getOrdesFromCart.map(itmVal => {
      console.log("Before Quantity", itmVal.Quantity);
      itmVal.Quantity = itmVal.incVal;
      console.log("After Quantity", itmVal.Quantity);
    });
    console.log("Final Composure Data", this.state.getOrdesFromCart);
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
        console.log("resAddOrderJson", resAddOrderJson);
        const resMessage = `Order placed successfully Order Id: ${
          resAddOrderJson.OrderID
        }`;
        this.setState({ msgData: resMessage, getOrdesFromCart: [] });
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
      if(this.state.getOrdesFromCart !== undefined) {
        this.state.getOrdesFromCart.map(dt => {
          dt.CustomerID = e;
        })
        this.setState({getOrdesFromCart: this.state.getOrdesFromCart});
        //console.log('Order List After', this.state.getOrdesFromCart);
      } else {
        console.log('Undefined Customer');
      }
    } else {
      console.log("Default Value");
    }
  };

  render() {
   //console.log("Orders List", this.state.customerId);   

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
                    <Text>{"\u0024"} 8.99</Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>Total Discounts</Text>
                  </Left>
                  <Right>
                    <Text>{"\u0024"} 0.00</Text>
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
                    <Text>{"\u0024"} 0.00</Text>
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
