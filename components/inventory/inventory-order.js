import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Switch,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
  Dimensions
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
  CardItem,
  CheckBox,
  Accordion,
  Picker
} from "native-base";
import Toast from "react-native-simple-toast";
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
      shareholders: [{ name: "" }],
      incVal: 0,
      stVal: 0,
      checked: false,
      addToOrderList: [],
      dup: "",
      searchInventoryOrdersList: [],
      invDiscountVal: this.props.navigation.getParam("discountValue"),
      invDiscountItemIdVal: this.props.navigation.getParam("discountItem"),
      selected2: "",
      valDiscountSwitch: false
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
        this.state.inventoryList.map(v => {
          (v.incVal = 0), (v.selectItem = false), (v.discountVal = 0);
        });
        // const setDisItem = this.state.inventoryList.filter(
        //   i => i.ItemID === this.state.invDiscountItemIdVal
        // );
        // setDisItem.map(d => {
        //   d.discountVal = this.state.invDiscountVal;
        //   console.log("Discount", d.discountVal);
        // });
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
  incrementOrder = (id, qty) => {
    const res = this.state.inventoryList.filter(v => v.ItemID === id);
    res.map(c => {
      console.log("-----", c.incVal, qty);
      const incremntVal = c.incVal + 1;
      if (incremntVal > qty) {
        alert("Max Quantity Reached");
      } else {
        console.log("Lesser Val");
        res.map(
          v => ((v.incVal = v.incVal + 1), (v.Quantity = v.Quantity - 1))
        );
        res.incVal = this.setState({
          orderItemCounter: this.state.orderItemCounter + 1
        });
        this.state.inventoryList.push(res);
      }
    });
  };

  // Decrement Counter by getting current value of an array
  decCounter(itmId, decQty) {
    const res = this.state.inventoryList.filter(v => v.ItemID === itmId);
    res.map(resp => {
      // console.log("-----", resp.incVal, decQty);
      const decrementVal = resp.incVal - 1;
      // console.log("decrementVal", decrementVal);
      if (decrementVal < 0) {
        alert(`Can't decrement value`);
      } else {
        res.map(
          v => ((v.incVal = v.incVal - 1), (v.Quantity = v.Quantity + 1))
        );
        res.incVal = this.setState({
          orderItemCounter: this.state.orderItemCounter - 1
        });
        this.state.inventoryList.push(res);
      }
    });
  }
  //Check which item is checked and get the array and overwrite it
  // If Item IncVal is greaterthan zero prompt a message
  onChangeCheck = itemId => {
    //console.log("Item Id", itemId);
    const checkedItem = this.state.inventoryList.filter(
      chkItm => chkItm.ItemID === itemId
    );
    checkedItem.map(chkValItm => {
      if (chkValItm.incVal === 0)
        alert("Add the item quantity before selecting item");
      else {
        if (!chkValItm.selectItem) chkValItm.selectItem = true;
        else chkValItm.selectItem = false;
      }
    });
    checkedItem.selectItem = this.setState({ checked: true });
    this.state.inventoryList.push(checkedItem);
  };
  // Adding the list of selected orders
  addListOfOrders = () => {
    //console.log("Welcome To orders");
    const addedOrderToCart = this.state.inventoryList.filter(
      addedItems => addedItems.selectItem === true
    );
    if (addedOrderToCart.length === 0) {
      //Toast.show('No Items are in cart.', Toast.TOP);
      Toast.showWithGravity("No items added in cart", Toast.LONG, Toast.CENTER);
    } else {
      this.setState({ addToOrderList: addedOrderToCart });
      console.log("Added List", addedOrderToCart);
      Toast.showWithGravity("Item has been added to order", Toast.LONG, Toast.CENTER);
    }
    
  };
  //Search the inventory based on keyword match
  onSearchInventoryOrder = txtInventoryFld => {
    const rsSrchInvtryOrder = this.state.inventoryList.filter(
      k =>
        //k.ItemID.toLowerCase().includes(txtInventoryFld.toLowerCase()) ||
        k.Description.toLowerCase().includes(txtInventoryFld.toLowerCase())
      // k.Quantity.contains(txtInventoryFld)
    );
    this.setState({
      searchInventoryOrdersList: rsSrchInvtryOrder,
      inventoryCount: rsSrchInvtryOrder.length
    });
  };
  // Enable the functionality of discount
  discountEnable = itm => {
    console.log("Item", itm);
    //this.setState({ valDiscountSwitch: true });
    if (itm) this.setState({ valDiscountSwitch: true });
    else this.setState({ valDiscountSwitch: false });
  };
  render() {
    const { navigation } = this.props;
    const cstmrId = navigation.getParam("customerID", "CUSTOMER-ID");
    const cstmrDistributorId = navigation.getParam(
      "customerDistributorId",
      "CUSTOMER_DIST_ID"
    );
    console.log("ID", cstmrId, cstmrDistributorId);
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
            <Title>Order</Title>
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
                  onChangeText={this.onSearchInventoryOrder}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <ScrollView>
            {this.state.searchInventoryOrdersList.length === 0
              ? this.state.inventoryList.map((itm, i) => (
                  <View key={i}>
                    <Card>
                      <CardItem>
                        <Left>
                          <CheckBox
                            onPress={() => this.onChangeCheck(itm.ItemID)}
                            checked={itm.selectItem}
                          />
                        </Left>
                        <Text style={{ fontWeight: "bold" }}>
                          {itm.Description}
                        </Text>
                      </CardItem>
                      <CardItem>
                        <Left>
                          <Text>Discount</Text>
                        </Left>
                        <Right>
                          <Switch
                            value={this.state.valDiscountSwitch}
                            onValueChange={this.discountEnable}
                          />
                        </Right>
                      </CardItem>
                      {this.state.valDiscountSwitch && (
                        <View>
                          <CardItem>
                            <View
                              style={{
                                flexDirection: "row"
                              }}
                            >
                              <Left>
                                <Text>Discount Mode</Text>
                              </Left>
                              <Right>
                                <Picker
                                  mode="dropdown"
                                  style={{ width: 200, height: 44 }}
                                  itemStyle={{ height: 44 }}
                                  selectedValue={this.state.selected2}
                                  onValueChange=""
                                >
                                  <Picker.Item label="Selct Discount Mode" />
                                  <Picker.Item label="$" value="$" />
                                  <Picker.Item label="%" value="%" />
                                </Picker>
                              </Right>
                            </View>
                          </CardItem>
                          <CardItem>
                            <View
                              style={{
                                flexDirection: "row"
                                //justifyContent: "space-around"
                              }}
                            >
                              <Left>
                                <Text>Discount Value</Text>
                              </Left>
                              <Right>
                                <Picker
                                  mode="dropdown"
                                  style={{ width: 200, height: 44 }}
                                  itemStyle={{ height: 44 }}
                                  selectedValue={this.state.selected2}
                                  onValueChange=""
                                >
                                  <Picker.Item
                                    label="Select your Discount Value"
                                    value=""
                                  />
                                  <Picker.Item label="0" value="0" />
                                  <Picker.Item label="5" value="5" />
                                  <Picker.Item label="10" value="10" />
                                  <Picker.Item label="15" value="15" />
                                  <Picker.Item label="20" value="20" />
                                  <Picker.Item label="25" value="25" />
                                  <Picker.Item label="30" value="30" />
                                </Picker>
                              </Right>
                            </View>
                          </CardItem>
                        </View>
                      )}
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
                            <View style={commonStyles.nestedRow}>
                              <Text>Qty Available </Text>
                              <Text>{itm.Quantity}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <TouchableHighlight
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    "InventoryOrderDiscount",
                                    {
                                      inventoryItemId: itm.ItemID
                                    }
                                  );
                                }}
                              >
                                <Text> Discount </Text>
                              </TouchableHighlight>
                              <Text>{itm.discountVal} %</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Msrp </Text>
                              <Text>
                                {"\u0024"}
                                {itm.Price}
                              </Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Designer</Text>
                              <Text>
                                {"\u0024"}
                                {itm.Price}
                              </Text>
                            </View>
                          </View>
                          <View style={commonStyles.column}>
                            <Right>
                              <TouchableOpacity
                                onPress={() =>
                                  this.incrementOrder(itm.ItemID, itm.Quantity)
                                }
                              >
                                <Icon
                                  name="plus"
                                  type="FontAwesome"
                                  style={{ color: "#f50" }}
                                />
                              </TouchableOpacity>

                              <Text style={{ fontWeight: "bold" }}>
                                {itm.incVal}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  this.decCounter(itm.ItemID, itm.Quantity)
                                }
                              >
                                <Icon
                                  name="minus"
                                  type="FontAwesome"
                                  style={{ color: "#f50" }}
                                />
                              </TouchableOpacity>
                            </Right>
                          </View>
                        </View>
                      </CardItem>
                    </Card>
                  </View>
                ))
              : this.state.searchInventoryOrdersList.map(
                  (srchInvOrdrItm, srchInvOrdrItmIndx) => (
                    <View key={srchInvOrdrItmIndx}>
                      <Card>
                        <CardItem>
                          <Left>
                            <CheckBox
                              onPress={() =>
                                this.onChangeCheck(srchInvOrdrItm.ItemID)
                              }
                              checked={srchInvOrdrItm.selectItem}
                            />
                          </Left>
                          <Text style={{ fontWeight: "bold" }}>
                            {srchInvOrdrItm.Description}
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
                              <View style={commonStyles.nestedRow}>
                                <Text>Qty Available </Text>
                                <Text>{srchInvOrdrItm.Quantity}</Text>
                              </View>
                              <View style={commonStyles.nestedRow}>
                                <TouchableHighlight
                                  onPress={() => {
                                    this.props.navigation.navigate(
                                      "InventoryOrderDiscount"
                                    );
                                  }}
                                >
                                  <Text> Discount </Text>
                                </TouchableHighlight>
                                <Text>{srchInvOrdrItm.discountVal} %</Text>
                              </View>
                              <View style={commonStyles.nestedRow}>
                                <Text>Msrp </Text>
                                <Text>
                                  {"\u0024"}
                                  {srchInvOrdrItm.Price}
                                </Text>
                              </View>
                              <View style={commonStyles.nestedRow}>
                                <Text>Designer</Text>
                                <Text>
                                  {"\u0024"}
                                  {srchInvOrdrItm.Price}
                                </Text>
                              </View>
                            </View>
                            <View style={commonStyles.column}>
                              <Right>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.incrementOrder(
                                      srchInvOrdrItm.ItemID,
                                      srchInvOrdrItm.Quantity
                                    )
                                  }
                                >
                                  <Icon
                                    name="plus"
                                    type="FontAwesome"
                                    style={{ color: "#f50" }}
                                  />
                                </TouchableOpacity>

                                <Text style={{ fontWeight: "bold" }}>
                                  {srchInvOrdrItm.incVal}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.decCounter(
                                      srchInvOrdrItm.ItemID,
                                      srchInvOrdrItm.Quantity
                                    )
                                  }
                                >
                                  <Icon
                                    name="minus"
                                    type="FontAwesome"
                                    style={{ color: "#f50" }}
                                  />
                                </TouchableOpacity>
                              </Right>
                            </View>
                          </View>
                        </CardItem>
                      </Card>
                    </View>
                  )
                )}
          </ScrollView>
        </Content>
        {this.renderLoading()}
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: deviceWidth,
            height: 70
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderWidth: 1,
              backgroundColor: "#FFFFFF",
              height: 100
            }}
          >
            <Button
              bordered
              style={{
                backgroundColor: "#00ffff",
                width: 120,
                height: 40,
                margin: 10,
                justifyContent: "center"
              }}
              onPress={this.addListOfOrders}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 15
                }}
              >
                Add to order
              </Text>
            </Button>
            <Button
              bordered
              style={{
                backgroundColor: "#00ffff",
                width: 120,
                height: 40,
                margin: 10,
                justifyContent: "center"
              }}
              onPress={() =>
                this.props.navigation.navigate("AddInventoryOrder", {
                  reviewOrderDetailsList: this.state.addToOrderList,
                  customerId: cstmrId
                })
              }
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 15
                  // margin: 10
                }}
              >
                Review Order
              </Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}
