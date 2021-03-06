import React from "react";
import store from '../store/store';
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
import Toast from "react-native-simple-toast";
import OptionsMenu from "react-native-options-menu";
import { getInventoryListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class DesignerInventory extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.stVal = 0;
    this.state = {
      loading: true,
      active: "true",
      distributorId: "",
      designerIdVal: this.props.navigation.getParam("searchedDesignerId"),
      designerIdName: this.props.navigation.getParam("searchDesignerName"),
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
      selDiscountVal: 0,
      selected2: "",
      valDiscountSwitch: false,
      valDiscount: 0,
      valDiscountType: "",
      btnDollarDiscount: false,
      btnPercentDiscount: false,
      getCartItems: this.props.navigation.getParam("addedCartToItems"),
      getObjDsgnr: this.props.navigation.getParam("objDesigner"),
      lowerLimit: 0,
      upperLimit: 2,
      prevScreenTouchPressTargetEvent: 0,
      screenTouchPressTargetEvent: 10,
      clckEvnt: this.props.navigation.getParam("clickOn"),
      pagingArr: [],
      txtSrch: ""
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    this._isMounted = true;
    var newState = store.getState();
      if (this._isMounted) {
        await this.setState({
          authToken: newState.tokenReducer.loginInfo.tokenKey,
          distributorId: newState.tokenReducer.loginInfo.distributorKey,
        });
      }  
    //if (this._isMounted) {
    // await AsyncStorage.getItem("LoginDetails").then(resLoginDtls => {
    //   resLoginDtls = JSON.parse(resLoginDtls);
    //   if (this._isMounted) {
    //     this.setState({
    //       distributorId: resLoginDtls.DistributorID,
    //       authToken: resLoginDtls.Token
    //     });
    //   }
    // });
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
          this.setState({ loading: false });
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
    let cartArr = [];
    if (this.state.getCartItems !== undefined) {
      this.state.getCartItems.map(cartData => cartArr.push(cartData));
    }
    const addedOrderToCart = this.state.pagingArr.filter(
      addedItems => addedItems.selectItem === true
    );
    if (addedOrderToCart.length === 0) {
      //Toast.show('No Items are in cart.', Toast.TOP);
      Toast.showWithGravity("No items added in cart", Toast.LONG, Toast.CENTER);
    } else {
      if (this.state.getCartItems !== undefined)
        addedOrderToCart.map(cartNewData => cartArr.push(cartNewData));
      {
        this.state.getCartItems === undefined
          ? this.setState({ addToOrderList: addedOrderToCart })
          : this.setState({ addToOrderList: cartArr });
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
  discountEnable = (discountMode, itmId) => {
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
  };
  // Discount Change text
  discountTextChange = (discountVal, id) => {
    const fltrItemId = this.state.inventoryList.filter(v => v.ItemID === id);
    fltrItemId.map(c => {
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
          Toast.showWithGravity(
            "Max Discount value reached",
            Toast.SHORT,
            Toast.CENTER
          );
          c.discountVal = 100;
          c.Discount = 100;
        } else {
          c.discountVal = discountVal;
        }
      }
      // Check Discount Value Condition
      if (c.discountType === "d") {
        if (discountVal >= c.Price) {
          c.discountVal = c.Price;
          c.Discount = c.Price;
          Toast.showWithGravity(
            "Max Discount Dollar reached",
            Toast.SHORT,
            Toast.CENTER
          );
        } else {
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
  };

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
    const { navigation } = this.props;
    const cstmrId = navigation.getParam("customerID", "CUSTOMER-ID");
    const cstmrDistributorId = navigation.getParam(
      "customerDistributorId",
      "CUSTOMER_DIST_ID"
    );
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
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
            <Text style={{ margin: 15, fontSize: 20 }}>
              {this.state.inventoryCount} Order, ID: {this.state.designerIdVal}{" "}
              {this.state.designerIdName}
            </Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item>
                <Input
                  placeholder="Search Order"
                  style={{
                    textAlign: "center",
                    height: 50,
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
          <ScrollView
            scrollEventThrottle={16}
            onTouchMove={e => {
              const targetVal = e.nativeEvent.locationY;
              this.setState(prevState => ({
                prevScreenTouchPressTargetEvent:
                  prevState.screenTouchPressTargetEvent,
                screenTouchPressTargetEvent: targetVal
              }));
              const direction =
                targetVal > this.state.prevScreenTouchPressTargetEvent
                  ? "down"
                  : "up";

              if (direction === "down") {
                this.setState(prevState => ({
                  lowerLimit: prevState.upperLimit,
                  upperLimit: prevState.upperLimit + 5
                }));
              }
              if (direction === "up") {
                this.setState(prevState => ({
                  lowerLimit: prevState.upperLimit - 2,
                  upperLimit: prevState.upperLimit - 2
                }));
              }
            }}
          >
            {/* {this.state.inventoryList.length === 0 ? (
              <Text style={commonStyles.warningMessage}>                
                No records found !
              </Text>
            ) : (
              <View />
            )} */}
            {this.state.searchInventoryOrdersList.length === 0
              ? this.state.inventoryList.map((itm, i) =>
                i >= 0 && i <= this.state.upperLimit ? (
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
                                width: "100%",
                                marginBottom: 20
                              }}
                            />
                          </View>
                          <View style={commonStyles.column}>
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Qty Available </Text>
                              <Text>{itm.Quantity}</Text>
                            </View>
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Discount</Text>                              
                              {itm.discountType === "d" ? (
                                <Text>{"\u0024"} {itm.discountVal}</Text>
                              ) : (
                                  <Text>{itm.discountVal} %</Text>
                                )}
                            </View>
                            {/* <View style={commonStyles.nestedRow}>
                              <Text>Retail</Text>
                              <Text>
                                {"\u0024"}
                                {itm.RetailPrice}
                              </Text>
                            </View> */}
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Designer</Text>
                              <Text>
                                {"\u0024"}
                                {itm.Price}
                              </Text>
                            </View>
                          </View>
                          <Right>
                            <View style={commonStyles.column}>
                              <Right>
                                <TouchableHighlight
                                  onPress={() =>
                                    this.incrementOrder(
                                      itm.ItemID,
                                      itm.Quantity
                                    )
                                  }
                                >
                                  <Icon
                                    name="plus"
                                    type="FontAwesome"
                                    style={{ color: "#61d0c8", fontSize: 30 }}
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
                                    style={{ color: "#61d0c8", fontSize: 30 }}
                                  />
                                </TouchableHighlight>
                              </Right>
                            </View>
                          </Right>
                          {/* <View style={commonStyles.column} /> */}
                        </View>
                      </CardItem>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
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
                ) : (
                    <View key={i} />
                  )
              )
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
                                width: "100%",
                                marginBottom: 10
                              }}
                            />
                          </View>
                          <View style={commonStyles.column}>
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Qty Available </Text>
                              <Text>{srchInvOrdrItm.Quantity}</Text>
                            </View>                            
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Discount</Text>                              
                              {srchInvOrdrItm.discountType === "d" ? (
                                <Text>{"\u0024"} {srchInvOrdrItm.discountVal}</Text>
                              ) : (
                                  <Text>{srchInvOrdrItm.discountVal} %</Text>
                                )}
                            </View>
                            {/* <View style={commonStyles.nestedRow}>
                                <Text>Retail</Text>
                                <Text>
                                  {"\u0024"}
                                  {srchInvOrdrItm.RetailPrice}
                                </Text>
                              </View> */}
                            <View style={commonStyles.designerInventoryRow}>
                              <Text>Designer</Text>
                              <Text>
                                {"\u0024"}
                                {srchInvOrdrItm.Price}
                              </Text>
                            </View>
                          </View>
                          <Right>
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
                                    style={{ color: "#61d0c8", fontSize: 30 }}
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
                                    style={{ color: "#61d0c8", fontSize: 30 }}
                                  />
                                </TouchableHighlight>
                              </Right>
                            </View>
                          </Right>
                          {/* <View style={commonStyles.column} /> */}
                        </View>
                      </CardItem>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <Text style={{ marginLeft: 5 }}>Discount</Text>
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
                backgroundColor: "#61d0c8",
                width: 120,
                height: 40,
                margin: 10,
                justifyContent: "center",
                borderColor: '#ffffff'
              }}
              onPress={this.addListOfOrders}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 'bold'
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
                borderColor: '#ffffff'
              }}
              onPress={() =>
                this.props.navigation.navigate("AddInventoryOrder", {
                  reviewOrderDetailsList: this.state.addToOrderList,
                  customerId: this.state.designerIdVal,
                  designerDtls: this.state.getObjDsgnr
                })
              }
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 'bold'
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
