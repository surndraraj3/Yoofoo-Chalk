import React from "react";
import { Text, View, ScrollView, AsyncStorage, } from "react-native";
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
import { addOrdersUrl } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      distributorId: "",
      authToken: "",
      getOrdesFromCart: this.props.navigation.getParam("orderDtlsList"),
      msgData: ""
    }
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
  render() {
    console.log('Orders List', this.state.getOrdesFromCart);    
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{flex: 1}}>
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
            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
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
                  <Left><Text>Remaining Due</Text></Left>
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
                <Button full style={{ backgroundColor: "#00ffff" }} onPress={this.saveOrderDtls}>
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
