import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  Dimensions,
  Image
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
  CheckBox
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import Toast from "react-native-simple-toast";
import { getInventoryListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class InventoryOrder extends React.Component {
  _isMounted = false;
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
      searchInventoryOrdersList: [],
      selDiscountVal: 0,
      invDiscountVal: this.props.navigation.getParam("discountValue"),
      invDiscountItemIdVal: this.props.navigation.getParam("discountItem"),
      valDiscountSwitch: false,
      valDiscount: 0,
      valDiscountType: "",
      btnDollarDiscount: false,
      btnPercentDiscount: false,
      getCartItems: this.props.navigation.getParam("addedCartToItems"),
      clckEvnt: this.props.navigation.getParam("clickOn"),
      pageNumber: 0,
      pagingArr: [],
      srchFlag: false,
      txtSrch: ""
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    this._isMounted = true;
    //if (this._isMounted) {
    await AsyncStorage.getItem("LoginDetails").then(resLoginDtls => {
      resLoginDtls = JSON.parse(resLoginDtls);
      if (this._isMounted) {
        this.setState({
          distributorId: resLoginDtls.DistributorID,
          authToken: resLoginDtls.Token
        });
      }
    });
    if (this._isMounted) this.loadInventoryOrderData();
    //}
  };
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      inventoryList: [],
      inventoryCount: 0,
      distributorId: "",
      authToken: ""
    });
    clearInterval(this.loadInventoryOrderData);
  }
  //Load Inventory Order data
  loadInventoryOrderData = () => {
    let invntryUrl = "";
    if (this.state.txtSrch.length ===0) {
      // console.log("false flag", this.state.txtSrch.length);
      invntryUrl = `${getInventoryListURL}${this.state.distributorId}/${
        this.state.pageNumber
      }`;
    } else {
      // console.log("True Search Flag", this.state.txtSrch.length);
      invntryUrl = `${getInventoryListURL}${this.state.distributorId}/${
        this.state.pageNumber
      }/${this.state.txtSrch}`;
    }
    //Get Inventory List data
    fetch(`${invntryUrl}`, {
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
        if (this._isMounted) {
          responseJson.map(v => {
            v.incVal = 0;
            v.selectItem = false;
            v.discountVal = 0;
            v.discountType = "";
            v.btnDollarDiscountVal = false;
            v.btnPercentDiscountVal = false;
          });
          this.setState({
            inventoryList: responseJson,
            inventoryCount: responseJson.length
          });
          this.setState({ loading: false});
        }
      })
      .catch(error => {
        console.error(error);
        if (this._isMounted) this.setState({ loading: false });
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
    const res = this.state.inventoryList.find(v => v.ItemID === id);
    this.setState({ orderItemCounter: res.incVal + 1 });
    res.incVal += 1;
    res.Quantity -= 1;
    if (qty === 0) {
      alert("Max Quantity Reached");
      res.incVal -= 1;
      res.Quantity += 1;
      this.setState({ orderItemCounter: res.incVal - 1 });
    }
  };

  // Decrement Counter by getting current value of an array
  decCounter(itmId, decQty) {
    const res = this.state.inventoryList.find(v => v.ItemID === itmId);
    const decrementVal = res.incVal - 1;
    if (decrementVal < 0) {
      alert(`Can't decrement value`);
    } else {
      res.incVal -= 1; // res[0].incVal - 1;
      res.Quantity += 1; // res[0].Quantity + 1;
      this.setState({ orderItemCounter: res.incVal - 1 });
    }
  }
  //Check which item is checked and get the array and overwrite it
  // If Item IncVal is greaterthan zero prompt a message
  onChangeCheck = itemId => {
    const checkedItem = this.state.inventoryList.find(
      chkItm => chkItm.ItemID === itemId
    );
    checkedItem.selectItem = this.setState({ checked: true });
    if (checkedItem.incVal === 0)
      alert("Add the item quantity before selecting item");
    else {
      if (!checkedItem.selectItem) {
        checkedItem.selectItem = true;
        this.state.pagingArr.push(checkedItem);
      } else checkedItem.selectItem = false;
    }
  };
  // Adding the list of selected orders
  addListOfOrders = () => {
    // console.log('asda', this.state.inventoryList)
    //console.log('Event', this.state.clckEvnt)
    this.setState({ addToOrderList: [] });
    let cartArr = [];
    if (this.state.getCartItems !== undefined) {
      this.state.getCartItems.map(cartData => cartArr.push(cartData));
    }
    const addedOrderToCart = this.state.pagingArr.filter(
      addedItems => addedItems.selectItem === true
    );
    //console.log("Welcome To Cart Items", addedOrderToCart);
    if (addedOrderToCart.length === 0) {
      //Toast.show('No Items are in cart.', Toast.TOP);
      Toast.showWithGravity("No items added in cart", Toast.LONG, Toast.CENTER);
    } else {
      if (this.state.getCartItems !== undefined)
        addedOrderToCart.map(cartNewData => cartArr.push(cartNewData));

      if (this.state.clckEvnt === 1) {
        this.setState({ addToOrderList: addedOrderToCart });
        cartArr.shift();
      } else {
        this.setState({ addToOrderList: cartArr });
      }

      Toast.showWithGravity(
        "Item has been added to order",
        Toast.SHORT,
        Toast.CENTER
      );
    }
  };
  //Search the inventory based on keyword match
  onSearchInventoryOrder = txtInventoryFld => {
    this.setState({ srchFlag: true, txtSrch: txtInventoryFld.toLowerCase() });
    this.loadInventoryOrderData();
    // const rsSrchInvtryOrder = this.state.inventoryList.filter(
    //   k =>
    //     //k.ItemID.toLowerCase().includes(txtInventoryFld.toLowerCase()) ||
    //     k.Description.toLowerCase().includes(txtInventoryFld.toLowerCase())
    //   // k.Quantity.contains(txtInventoryFld)
    // );
    // this.setState({
    //   searchInventoryOrdersList: rsSrchInvtryOrder,
    //   inventoryCount: rsSrchInvtryOrder.length
    // });
  };
  // Enable the functionality of discount
  discountEnable = (discountMode, itmId) => {
    //console.log("Mode", discountMode, "Item Id", itmId);
    const discounRes = this.state.inventoryList.filter(v => v.ItemID === itmId);
    discounRes.map(v => {
      v.discountType = discountMode;
      discounRes.discountType = this.setState({
        valDiscountType: v.discountType
      });
      if (discountMode === "d") {
        v.btnDollarDiscountVal = true;
        v.btnPercentDiscountVal = false;
        this.setState({ btnDollarDiscount: true, btnPercentDiscount: false });
      }
      if (discountMode === "p") {
        v.btnDollarDiscountVal = false;
        v.btnPercentDiscountVal = true;
        this.setState({ btnDollarDiscount: false, btnPercentDiscount: true });
      }
      this.state.inventoryList.push(discounRes);
    });
    //console.log("Mode Res", discounRes);
  };
  // Discount Change text
  discountTextChange = (discountVal, id) => {
    const fltrItemId = this.state.inventoryList.filter(v => v.ItemID === id);
    fltrItemId.map(c => {
      //console.log(c.discountType, 'Discount Mode');
      if (c.discountType === "") {
        Toast.showWithGravity(
          "Select discount mode",
          Toast.SHORT,
          Toast.CENTER
        );
        c.discountVal = 0;
        c.Discount = 0;
      }
      // Check Percentage Value Condition
      if (c.discountType === "p") {
        if (discountVal >= 100.0) {
          //console.log('');
          Toast.showWithGravity(
            "Max Discount value reached",
            Toast.SHORT,
            Toast.CENTER
          );
          c.discountVal = 100;
          c.Discount = 100;
        } else {
          //console.log('Discount applicable');
          c.discountVal = discountVal;
        }
      }
      // Check Discount Value Condition
      if (c.discountType === "d") {
        if (discountVal >= c.RetailPrice) {
          //console.log('Max Discount Dollar reached');
          c.discountVal = c.RetailPrice;
          c.Discount = c.RetailPrice;
          Toast.showWithGravity(
            "Max Discount Dollar reached",
            Toast.SHORT,
            Toast.CENTER
          );
        } else {
          //console.log("Discount applicable");
          c.discountVal = discountVal;
          c.Discount = discountVal;
        }
      }

      fltrItemId.discountVal = this.setState({
        valDiscount: discountVal
      });
      this.state.inventoryList.push(fltrItemId);
      // }
    });
    //console.log("Discount Res", fltrItemId);
  };
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
  //Review Order Button
  onReviewOrderClck = () => {
    // console.log("Review Click", this.state.addToOrderList.length);
    const { navigation } = this.props;
    if (this.state.addToOrderList.length !== 0) {
      const cstmrId = navigation.getParam("customerID", "CUSTOMER-ID");
      this.props.navigation.navigate("AddInventoryOrder", {
        reviewOrderDetailsList: this.state.addToOrderList,
        customerId: cstmrId
      });
    } else {
      Toast.showWithGravity(
        "No items added to cart",
        Toast.SHORT,
        Toast.CENTER
      );
    }
  };

  render() {
    const { navigation } = this.props;
    const cstmrDistributorId = navigation.getParam(
      "customerDistributorId",
      "CUSTOMER_DIST_ID"
    );
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
          <View style={{ backgroundColor: "#e6e6e6" }}>
            {/* <Text style={{ margin: 15, fontSize: 20 }}>
              {this.state.inventoryCount} Order
            </Text> */}
            <View style={{ margin: 15 }}>
              <Item>
                <Input
                  placeholder="search items"
                  style={{
                    textAlign: "center",
                    height: 50
                    // borderWidth: 2,
                    // borderColor: "#00e6e6",
                    // borderRadius: 20,
                    // backgroundColor: "#FFFFFF"
                  }}
                  onChangeText={this.onSearchInventoryOrder}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <ScrollView>
            {/* {this.state.inventoryList.length === 0 ? (
              <Text style={commonStyles.warningMessage}>
                {" "}
                No records found !
              </Text>
            ) : (
              <View /> i >= this.state.lowerLimit && 
            )} */}
            {this.state.searchInventoryOrdersList.length === 0
              ? this.state.inventoryList.map((itm, i) => (
                  // i >= 0 && i <= this.state.upperLimit ? (
                  <View key={i}>
                    <Text style={commonStyles.warningMessage}>
                      {itm.length === 0 ? "No records found" : ""}
                    </Text>
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
                      <CardItem bordered>
                        <View style={commonStyles.row}>
                          <View
                            style={{
                              flexDirection: "column",
                              width: 100,
                              height: 50
                            }}
                          >
                            <Image
                              source={{ uri: `${itm.SmallPicture}` }}
                              style={{
                                height: 100,
                                width: "100%"
                                // borderRadius: 40 / 2
                              }}
                            />
                          </View>
                          <View style={commonStyles.column}>
                            <View style={commonStyles.nestedRow}>
                              <Text>Qty Available </Text>
                              <Text>{itm.Quantity}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <TouchableHighlight
                              // onPress={() => {
                              //   this.props.navigation.navigate(
                              //     "InventoryOrderDiscount",
                              //     {
                              //       inventoryItemId: itm.ItemID
                              //     }
                              //   );
                              // }}
                              >
                                <Text> Discount </Text>
                              </TouchableHighlight>
                              <Text>{itm.discountVal}</Text>
                              {itm.discountType === "d" ? (
                                <Text>{"\u0024"}</Text>
                              ) : (
                                <Text>%</Text>
                              )}
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Retail</Text>
                              <Text>
                                {"\u0024"}
                                {itm.RetailPrice}
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
                              <TouchableHighlight
                                onPress={() =>
                                  this.incrementOrder(itm.ItemID, itm.Quantity)
                                }
                              >
                                <Icon
                                  name="plus"
                                  type="FontAwesome"
                                  style={{ color: "#61d0c8", fontSize: 40 }}
                                />
                              </TouchableHighlight>

                              <Text style={{ fontWeight: "bold" }}>
                                {itm.incVal}
                              </Text>
                              <TouchableHighlight
                                onPress={() =>
                                  this.decCounter(itm.ItemID, itm.Quantity)
                                }
                              >
                                <Icon
                                  name="minus"
                                  type="FontAwesome"
                                  style={{ color: "#61d0c8", fontSize: 40 }}
                                />
                              </TouchableHighlight>
                            </Right>
                          </View>
                        </View>
                      </CardItem>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around"
                        }}
                      >
                        <Text style={{ margin: 10 }}>Discount</Text>

                        <Button
                          style={
                            itm.btnDollarDiscountVal
                              ? { margin: 5 }
                              : { margin: 5, backgroundColor: "#61d0c8" }
                          }
                          onPress={() => {
                            this.discountEnable("d", itm.ItemID);
                          }}
                          disabled={itm.btnDollarDiscountVal}
                        >
                          <Icon
                            name="dollar"
                            type="FontAwesome"
                            style={{ color: "#ffffff" }}
                          />
                        </Button>
                        <Button
                          style={
                            itm.btnPercentDiscountVal
                              ? { margin: 5 }
                              : { margin: 5, backgroundColor: "#61d0c8" }
                          }
                          onPress={() => {
                            this.discountEnable("p", itm.ItemID);
                          }}
                          disabled={itm.btnPercentDiscountVal}
                        >
                          <Icon
                            name="percent"
                            type="FontAwesome"
                            style={{ color: "#ffffff" }}
                          />
                        </Button>
                        <TextInput
                          autoCapitalize="sentences"
                          value={this.state.selDiscountVal}
                          onChangeText={txtVal => {
                            this.discountTextChange(txtVal, itm.ItemID);
                          }}
                          placeholder="Discount"
                          style={{
                            width: 60,
                            height: 30,
                            borderWidth: 1,
                            margin: 5
                          }}
                          keyboardType="numeric"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                          autoCapitalize="sentences"
                        />
                      </View>
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
                            <View
                              style={{
                                flexDirection: "column",
                                width: 100,
                                height: 50
                              }}
                            >
                              <Image
                                source={{
                                  uri: `${srchInvOrdrItm.SmallPicture}`
                                }}
                                style={{
                                  height: 100,
                                  width: "100%"
                                  // borderRadius: 40 / 2
                                }}
                              />
                            </View>
                            <View style={commonStyles.column}>
                              <View style={commonStyles.nestedRow}>
                                <Text>Qty Available </Text>
                                <Text>{srchInvOrdrItm.Quantity}</Text>
                              </View>
                              <View style={commonStyles.nestedRow}>
                                <TouchableHighlight
                                // onPress={() => {
                                //   this.props.navigation.navigate(
                                //     "InventoryOrderDiscount"
                                //   );
                                // }}
                                >
                                  <Text> Discount </Text>
                                </TouchableHighlight>
                                <Text>{srchInvOrdrItm.discountVal} %</Text>
                              </View>
                              <View style={commonStyles.nestedRow}>
                                <Text>Retail</Text>
                                <Text>
                                  {"\u0024"}
                                  {srchInvOrdrItm.RetailPrice}
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
                                <TouchableHighlight
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
                                    style={{ color: "#61d0c8", fontSize: 40 }}
                                  />
                                </TouchableHighlight>

                                <Text style={{ fontWeight: "bold" }}>
                                  {srchInvOrdrItm.incVal}
                                </Text>
                                <TouchableHighlight
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
                                    style={{ color: "#61d0c8", fontSize: 40 }}
                                  />
                                </TouchableHighlight>
                              </Right>
                            </View>
                          </View>
                        </CardItem>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text style={{ margin: 10 }}>Discount</Text>
                          <Button
                            style={
                              srchInvOrdrItm.btnDollarDiscountVal
                                ? { margin: 5 }
                                : { margin: 5, backgroundColor: "#61d0c8" }
                            }
                            onPress={() => {
                              this.discountEnable("d", srchInvOrdrItm.ItemID);
                            }}
                            disabled={srchInvOrdrItm.btnDollarDiscountVal}
                          >
                            <Icon
                              name="dollar"
                              type="FontAwesome"
                              style={{ color: "#55e6f6" }}
                            />
                          </Button>
                          <Button
                            style={
                              srchInvOrdrItm.btnPercentDiscountVal
                                ? { margin: 5 }
                                : { margin: 5, backgroundColor: "#61d0c8" }
                            }
                            onPress={() => {
                              this.discountEnable("p", srchInvOrdrItm.ItemID);
                            }}
                            disabled={srchInvOrdrItm.btnPercentDiscountVal}
                          >
                            <Icon
                              name="percent"
                              type="FontAwesome"
                              style={{ color: "#55e6f6" }}
                            />
                          </Button>
                          <TextInput
                            autoCapitalize="sentences"
                            value={this.state.selDiscountVal}
                            onChangeText={txtVal => {
                              this.discountTextChange(
                                txtVal,
                                srchInvOrdrItm.ItemID
                              );
                            }}
                            placeholder="Discount"
                            style={{
                              width: 60,
                              height: 30,
                              borderLeftWidth: 1,
                              borderRightWidth: 1,
                              margin: 5
                            }}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                            autoCapitalize="sentences"
                          />
                        </View>
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
            bottom: 0
          }}
        />
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
            <TouchableHighlight
              onPress={() => {
                this.setState(prevState => {
                  return { pageNumber: prevState.pageNumber - 1 };
                });
                this.loadInventoryOrderData();
              }}
            >
              <Image source={require("../../assets/arrowleft.png")} />
            </TouchableHighlight>
            <Button
              bordered
              style={{
                backgroundColor: "#61d0c8",
                width: 120,
                height: 40,
                margin: 10,
                justifyContent: "center",
                borderColor: "#ffffff"
              }}
              onPress={this.addListOfOrders}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                Add to order
              </Text>
            </Button>
            <Button
              bordered
              style={{
                backgroundColor: "#61d0c8",
                width: 120,
                height: 40,
                margin: 10,
                justifyContent: "center",
                borderColor: "#ffffff"
              }}
              onPress={this.onReviewOrderClck}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                Review Order
              </Text>
            </Button>

            <TouchableHighlight
              onPress={() => {
                this.setState(prevState => {
                  return { pageNumber: prevState.pageNumber + 1 };
                });
                this.loadInventoryOrderData();
              }}
            >
              <Image source={require("../../assets/arrow.png")} />
            </TouchableHighlight>
          </View>
        </View>
      </Container>
    );
  }
}
