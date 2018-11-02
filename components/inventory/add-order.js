import React from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Container,
  Content,
  CheckBox,
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
  CardItem
} from "native-base";
import commonStyles from "../styles/styles";

export default class AddInventoryOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      getListofOrdersPrevScreen: this.props.navigation.getParam(
        "reviewOrderDetailsList"
      ),
      listOfOrders: []
    };
  }
  render() {
    // const otherParam = this.props.navigation.getParam('reviewOrderDetailsList', 'some default value');
    //console.log("otherParam", this.state.getListofOrdersPrevScreen);
    // this.setState({ listOfOrders: otherParam });
    // const dest = JSON.stringify(otherParam);
    // const strngFy = dest.replace(/[[\]]/g,'');
    // console.log('dest', dest.replace(/[[\]]/g,''));
    // this.state.listOfOrders.push(strngFy);
    // console.log('Final', JSON.stringify(this.state.listOfOrders));
    // this.setState({ listOfOrders: this.state.getListofOrders});
    //this.state.listOfOrders.push(this.state.getListofOrdersPrevScreen)
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
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
            <Button transparent>
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
                            {/* <Icon
                              name="plus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            /> */}
                            <Text style={{ fontWeight: "bold" }}>
                              {reviewItmLst.incVal}
                            </Text>
                            {/* <Icon
                              name="minus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            /> */}
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
              <Text style={{ color: "#42f4f1", fontSize: 20,  fontWeight:'bold'}}>
                Continue Shopping
              </Text>
            </View>
            <Button bordered style={commonStyles.footerButton}>
              <Text style={commonStyles.footerText}>Checkout</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}
