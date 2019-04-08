import React from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
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
import commonStyles from "../styles/styles";
import { customerOrderURL } from "../common/url_config";

// const { navigation } = this.props;

export default class TransferOrder extends React.Component {
  constructor(props) {
    super(props);
    // const customerId = this.props.navigation.getParam("customerId");
    this.state = {
      loading: false,
      customerId: this.props.navigation.getParam("customerId"),
      orderData: []
    };
  }
  componentDidMount() {
    // this.setState({ loading: true });
    //console.log("Order Id URL", `${customerOrderURL}${this.state.customerId}`);
    fetch(`${customerOrderURL}${this.state.customerId}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        //  console.log(responseJson);
        this.setState({
          orderData: responseJson
        });
        // this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
        // this.setState({ loading: false });
      });
  }
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

  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        {/* <Text>itemId: {this.state.customerId}</Text> */}
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
            <Title>Transfer Order</Title>
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
          <ScrollView>
            <View>              
              {this.state.orderData.map((data, i) => {
                //   console.log("Data", data.companyField);
                return (
                  <View key={i}>
                    <Card>
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
                            <View
                              style={{ flexDirection: "row", flexWrap: "wrap" }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {data.companyField}
                              </Text>
                            </View>
                            {/* <Text style={{ numberOfLines:1, fontWeight: "bold" }}>{data.companyField}</Text> */}
                            <View style={commonStyles.nestedRow}>
                              <Text>Qty Available </Text>
                              <Text>{data.priceTypeField}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Discount </Text>
                              <Text>{data.shipMethodIDField}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Mrp </Text>
                              <Text>{data.discountPercentField}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Designer Price </Text>
                              <Text>{data.orderStatusField}</Text>
                            </View>
                          </View>
                          <View style={commonStyles.column}>
                            <Right>
                              <Icon
                                name="plus"
                                type="FontAwesome"
                                style={{ color: "#61d0c8", fontSize: 30 }}
                              />
                              <Text style={{ fontWeight: "bold" }}>3</Text>
                              <Icon
                                name="minus"
                                type="FontAwesome"
                                style={{ color: "#61d0c8", fontSize: 30 }}
                              />
                            </Right>
                          </View>
                        </View>
                      </CardItem>
                    </Card>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
