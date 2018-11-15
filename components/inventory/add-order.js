import React from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Header,
  Body,
  Button,
  Left,
  Right,
  Title,
  Card,
  CardItem,
  Toast
} from "native-base";
import { addOrdersUrl } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class AddInventoryOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      getListofOrdersPrevScreen: this.props.navigation.getParam(
        "reviewOrderDetailsList"
      ),
      getCustomerId: this.props.navigation.getParam("customerId"),
      listOfOrders: [],
      distributorId: "",
      authToken: "",
      count: 0
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
    this.state.getListofOrdersPrevScreen.map(v => {
      (v.OrderID = ""),
        (v.DesignerID = this.state.distributorId),
        (v.CustomerID = this.state.getCustomerId),
        (v.Discount = 20);
    });
  };
  
  //save checkout orders
  saveOrderDtls = () => {
    console.log(
      "Welcom to data",
      this.state.distributorId,
      this.state.getListofOrdersPrevScreen
    );
    this.state.getListofOrdersPrevScreen.map(itmVal => {
      console.log("Before Quantity", itmVal.Quantity);
      itmVal.Quantity = itmVal.incVal;
      console.log("After Quantity", itmVal.Quantity);
    });
    console.log("Final Composure Data", this.state.getListofOrdersPrevScreen);
    fetch(`${addOrdersUrl}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      },
      body: JSON.stringify(this.state.getListofOrdersPrevScreen)
    })
      .then(response => response.json())
      .then(resAddOrderJson => {
        console.log("resAddOrderJson", resAddOrderJson);
        this.setState({ count: this.state.count + 1 });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {    
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("InventoryOrder")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title> Review Order</Title>
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
        <Content padder>
          <View style={{ backgroundColor: "#e6e6e6" }}>
            <Text style={{ margin: 15, fontSize: 20 }}>
              {this.state.getListofOrdersPrevScreen.length} Review Order
            </Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item rounded>
                <Input
                  placeholder="Search Review Order"
                  style={{
                    textAlign: "center",
                    height: 50,
                    borderWidth: 2,
                    borderColor: "#00e6e6",
                    borderRadius: 20,
                    backgroundColor: "#FFFFFF"
                  }}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <ScrollView>
            {this.state.getListofOrdersPrevScreen.map(
              (reviewItmLst, reviewIndex) => (
                <View key={reviewIndex}>
                  <Card>
                    <CardItem header>
                      {/* <CheckBox checked={true} /> */}
                      <Text style={{ fontWeight: "bold", margin: 10 }}>
                        {reviewItmLst.Description}
                      </Text>
                    </CardItem>
                    <CardItem>
                      <View style={commonStyles.row}>
                        <View style={commonStyles.column}>
                          <Icon
                            active
                            name="birthday-cake"
                            type="FontAwesome"
                            style={{ color: "#ff6666" }}
                          />
                        </View>
                        <View style={commonStyles.column}>
                          <View style={commonStyles.nestedRow}>
                            <Left>
                              <Text>Qty Available </Text>
                            </Left>
                            <Right>
                              <Text>{reviewItmLst.Quantity}</Text>
                            </Right>
                          </View>
                          <View style={commonStyles.nestedRow}>
                            <Left>
                              <Text>Discount </Text>
                            </Left>
                            <Right>
                              <Text>20%</Text>
                            </Right>
                          </View>
                          <View style={commonStyles.nestedRow}>
                            <Left>
                              <Text>Msrp </Text>
                            </Left>
                            <Right>
                              <Text>
                                {"\u0024"} {reviewItmLst.Price}
                              </Text>
                            </Right>
                          </View>
                          <View style={commonStyles.nestedRow}>
                            <Left>
                              <Text>Designer</Text>
                            </Left>
                            <Right>
                              <Text>
                                {"\u0024"} {reviewItmLst.Price}
                              </Text>
                            </Right>
                          </View>
                        </View>
                        <View style={commonStyles.column}>
                          <Right>
                            <Icon
                              name="plus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            />
                            <Text style={{ fontWeight: "bold" }}>
                              {reviewItmLst.incVal}
                            </Text>
                            <Icon
                              name="minus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            />
                          </Right>
                        </View>
                      </View>
                    </CardItem>
                  </Card>
                </View>
              )
            )}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              margin: 10
            }}
          />
        </Content>
        <View style={commonStyles.footerContainer}>
          <View style={commonStyles.footerInnerContainer}>
            <View style={{ margin: 20 }}>
              <Text
                style={{ color: "#42f4f1", fontSize: 20, fontWeight: "bold" }}
              >
                Continue Shopping
              </Text>
            </View>
            <Button
              bordered
              style={commonStyles.footerButton}
              onPress={this.saveOrderDtls}
            >
              <Text style={commonStyles.footerText}>Checkout</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}
