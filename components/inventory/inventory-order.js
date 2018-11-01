import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  Image, Dimensions
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
  CardItem,
  CheckBox,
  Fab
} from "native-base";
import { getInventoryListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class InventoryOrder extends React.Component {
  constructor(props) {
    super(props);
    this.stVal = 0;
    this.state = {
      loading: true,
      active: "true",
      distributorId: "",
      authToken: "",
      inventoryList: [],
      inventoryCount: 0,
      orderItemCounter: 0,
      countInfo: [],
      shareholders: [{ name: '' }],
      incVal: 0,
      stVal: 0
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    await AsyncStorage.getItem("LoginDetails").then(resLoginDtls => {
      resLoginDtls = JSON.parse(resLoginDtls);
      this.setState({
        distributorId: resLoginDtls.DistributorID,
        authToken: resLoginDtls.Token
      });
    });
    //Get Inventory List data
    fetch(`${getInventoryListURL}${this.state.distributorId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        this.setState({
          inventoryList: responseJson,
          inventoryCount: responseJson.length
        });
        this.state.inventoryList.map(v => v.incVal = 0)
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false });
      });
  };
  // Loading Spinner
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
  //Increment Counter and check whether it is exceeded more than quantity
  incrementOrder = (id) => {
    // const incCntr = this.state.orderItemCounter;
    //console.log('Welcome Increment'); 
    const res = this.state.inventoryList.filter(v => v.ItemID === id);
    res.map(v => v.incVal = v.incVal + 1)
    res.incVal = this.setState({ orderItemCounter: this.state.orderItemCounter + 1 });
    // const s = 'surendra';
    //console.log('response', res);
    this.state.inventoryList.push(res);

  };

  // Decrement Counter
  decCounter(itmId) {
    // console.error('des', itmId);
    //.log('Decrement', this.state.orderItemCounter, itmId);
    //let s = 0;
    const res = this.state.inventoryList.filter(v => v.ItemID === itmId);
    res.map(v => v.incVal = v.incVal - 1)
    res.incVal = this.setState({ orderItemCounter: this.state.orderItemCounter - 1 });
    // const s = 'surendra';
    //console.log('response', res);
    this.state.inventoryList.push(res);
  }

  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Order</Title>
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
          <View style={{ backgroundColor: "#e6e6e6" }}>
            <Text style={{ margin: 15, fontSize: 20 }}>
              {this.state.inventoryCount} Order
            </Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item rounded>
                <Input
                  placeholder="Search Order"
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
            {this.state.inventoryList.map((itm, i) => (
              <View key={i}>
                <Card>
                  <CardItem>
                    <Left>
                      <CheckBox checked={true} />
                    </Left>
                    <Text style={{ fontWeight: "bold" }}>
                      {itm.Description}
                    </Text>
                  </CardItem>
                  <CardItem bordered>
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
                        {/* <View
                          style={{ flexDirection: "row", flexWrap: "wrap" }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {itm.Description}
                          </Text>
                        </View> */}
                        <View style={commonStyles.nestedRow}>
                          <Text>Qty Available </Text>
                          <Text>{itm.Quantity}</Text>
                        </View>
                        <View style={commonStyles.nestedRow}>
                          <Text>Discount </Text>
                          <Text>20%</Text>
                        </View>
                        <View style={commonStyles.nestedRow}>
                          <Text>Msrp </Text>
                          <Text>
                            {"\u0024"}
                            10
                          </Text>
                        </View>
                        <View style={commonStyles.nestedRow}>
                          <Text>Designer</Text>
                          <Text>
                            {"\u0024"}
                            4.59
                          </Text>
                        </View>
                      </View>
                      <View style={commonStyles.column}>
                        <Right>
                          <TouchableOpacity
                            onPress={() => this.incrementOrder(itm.ItemID)}>
                            <Icon
                              name="plus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            />
                          </TouchableOpacity>

                          <Text style={{ fontWeight: "bold" }}>
                            {itm.incVal}
                          </Text>
                          <TouchableOpacity onPress={() => this.decCounter(itm.ItemID)}>
                            <Icon
                              name="minus"
                              type="FontAwesome"
                              style={{ color: "#f50" }}
                            />
                          </TouchableOpacity>
                        </Right>
                      </View>
                      {/* <View style={commonStyles.column}>
                        <Text style={{ fontWeight: "bold" }}>{itm.Description}</Text>
                        <View style={commonStyles.nestedRow}>
                          <Text>SKU</Text>
                          <Text>{itm.ItemID}</Text>
                          <Text>MSRP</Text>
                          <Text>10</Text>
                        </View>
                        <View style={commonStyles.nestedRow}>
                          <Text>Size </Text>
                          <Text>{itm.ItemID}</Text>
                          <Text>Count</Text>
                          <Text>{itm.Quantity}</Text>
                        </View>
                      </View> */}
                    </View>
                  </CardItem>
                </Card>
              </View>
            ))}
          </ScrollView>
        </Content>
        {this.renderLoading()}
        <View style={{ position: 'absolute', right: 0, bottom: 0, width: deviceWidth, height: 50 }}>
          <Card>
            <CardItem>
              <Left>
                <Text>1 Item</Text>
              </Left>
              <Right>

                <Button bordered style={{ backgroundColor: "#00ffff", width: 120, height: 40 }} onPress={() => this.props.navigation.navigate("AddInventoryOrder")}>
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 15,
                      margin: 10
                    }}
                  >
                    Create Order
                  </Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </View>
      </Container>
    );
  }
}
