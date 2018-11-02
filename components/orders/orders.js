import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Picker,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Content,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title,
  Item,
  Input
} from "native-base";
// import {
//   Menu,
//   MenuProvider,
//   MenuOptions,
//   MenuOption,
//   MenuTrigger
// } from "react-native-popup-menu";
import { getOrdersListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      orderCount: 0,
      distributorId: "",
      authToken: "",
      txtSearchBox: "",
      searchOrdersList: [],
      pickerModalState: false,
      language: ""
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    await AsyncStorage.getItem("LoginDetails")
      // .then(response => response.json())
      .then(responseJson => {
        responseJson = JSON.parse(responseJson);
        //console.log(responseJson.message, responseJson.DistributorID);
        this.setState({
          distributorId: responseJson.DistributorID,
          authToken: responseJson.Token
        });
      });
    console.log("Order URL", `${getOrdersListURL}${this.state.distributorId}`);
    fetch(
      // "http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/orders/OrdersByDesignerID/14711",
      `${getOrdersListURL}${this.state.distributorId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log("Data", responseJson);
        this.setState({
          dataSource: responseJson,
          orderCount: responseJson.length
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  };
  onOpenMenu = openMenuid => {
    console.log("Ids", openMenuid);
    UIManager.showPopupMenu(
      findNodeHandle(this._button),
      ["Open", "Ressend"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        console.log(`${e} : ${i}`);
        if (i === 0) {
          this.props.navigation.navigate("TransferOrder", {
            customerId: openMenuid
          });
        } else {
          console.log(`${e} : ${i}`);
        }
      }
    );
  };
  // Filter by text box search
  onChangeOrder = txtSrchFild => {
    //txtSearchBox
    console.log("Search Field", txtSrchFild);
    const res = this.state.dataSource.filter(v =>
      v.Customer.includes(txtSrchFild)
    );
    this.setState({ searchOrdersList: res, orderCount: res.length });
    if (res.length === 0) {
      console.log("length zero");
    } else {
      console.log("Lent count");
    }
    console.log("Response", res);
  };

  render() {
    // console.log("Lang", this.state.language);
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
            <Title>Orders</Title>
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
              {this.state.orderCount} Order
            </Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item rounded>
                <Input
                  placeholder="Order Number, Name or Designer Id"
                  style={{
                    textAlign: "center",
                    height: 50,
                    borderWidth: 2,
                    borderColor: "#00e6e6",
                    borderRadius: 20,
                    backgroundColor: "#FFFFFF"
                  }}
                  onChangeText={this.onChangeOrder}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <View style={commonStyles.row}>
            <Text>Customer</Text>
            <Text>Order Date</Text>
            <Text>Order #</Text>
            <Text>Action</Text>
          </View>
          {/* <View style={commonStyles.row}>
            <Text>11</Text>
            <Text>7/12/2018</Text>
            <Text>Lisa Barton</Text>
            <TouchableOpacity
              ref={e => {
                this._button = e;
              }}
              onPress={() => this.onOpenMenu("261")}
              style={commonStyles.iconCircle}
            >
              <Icon
                name="ellipsis-h"
                type="FontAwesome"
                style={{ fontSize: 20, color: "#55e6f6" }}
              />
            </TouchableOpacity>
          </View> */}
          <Text style={commonStyles.warningMessage}>
            {this.state.orderCount === 0 ? "No Orders Found" : ""}
          </Text>
          {this.state.searchOrdersList.length === 0
            ? this.state.dataSource.map((orderItem, indx) => (
                <View key={indx}>
                  <Text style={commonStyles.warningMessage}>
                    {orderItem.length === 0 ? "No Orders Found" : ""}
                  </Text>
                  <View style={commonStyles.row}>
                    <Text>{orderItem.Customer}</Text>
                    <Text>{orderItem.OrderDate}</Text>
                    <Text>{orderItem.OrderNum}</Text>
                    <Picker
                      selectedValue={this.state.language}
                      mode="dropdown"
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: "#55e6f6",
                        borderRadius: 15,
                        borderWidth: 1
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        console.log("221", itemValue, itemIndex);
                        this.setState({ language: itemValue });
                        this.props.navigation.navigate("ResendInvoice")
                      }}
                    >
                      <Picker.Item label="" value="" />
                      <Picker.Item label="View Invoice" value="ViewInvoice" />
                    </Picker>
                    {/* <TouchableOpacity>
                      <MenuProvider
                        style={{ flexDirection: "column", padding: 20 }}
                      >
                        <Menu
                          onSelect={value => alert(`Selected number: ${value}`)}
                          style={commonStyles.iconCircle}
                        >
                          <MenuTrigger>
                            <Icon
                              name="ellipsis-v"
                              type="FontAwesome"
                              style={{ fontSize: 20, color: "#55e6f6" }}
                            />
                          </MenuTrigger>
                          <MenuOptions>
                            <MenuOption
                              value={1}
                              onSelect={() =>
                                this.props.navigation.navigate("ResendInvoice")
                              }
                            >
                              <Text style={{ color: "#000000" }}>
                                View Invoice
                              </Text>
                            </MenuOption>
                            <MenuOption
                              value={3}
                              disabled={true}
                              text="Three"
                            />
                          </MenuOptions>
                        </Menu>
                      </MenuProvider>
                    </TouchableOpacity> */}
                  </View>
                </View>
              ))
            : this.state.searchOrdersList.map((orderItem, indx) => (
                <View key={indx}>
                  <Text style={commonStyles.warningMessage}>
                    {orderItem.length === 0 ? "No Orders Found" : ""}
                  </Text>
                  <View style={commonStyles.row}>
                    <Text>{orderItem.Customer}</Text>
                    <Text>{orderItem.OrderDate}</Text>
                    <Text>{orderItem.OrderNum}</Text>
                    <Picker
                      selectedValue={this.state.language}
                      mode="dropdown"
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: "#55e6f6",
                        borderRadius: 15,
                        borderWidth: 1
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        console.log("221", itemValue);
                        this.setState({ language: itemValue });
                        this.props.navigation.navigate("ResendInvoice");
                      }}
                    >
                      <Picker.Item label="" value="" />
                      <Picker.Item label="View Invoice" value="ViewInvoice" />
                    </Picker>

                    {/* <TouchableOpacity>
                      <MenuProvider
                        style={{ flexDirection: "column", padding: 20 }}
                      >
                        <Menu
                          onSelect={value => alert(`Selected number: ${value}`)}
                          style={commonStyles.iconCircle}
                        >
                          <MenuTrigger>
                            <Icon
                              name="ellipsis-v"
                              type="FontAwesome"
                              style={{ fontSize: 20, color: "#55e6f6" }}
                            />
                          </MenuTrigger>
                          <MenuOptions>
                            <MenuOption
                              value={1}
                              onSelect={() =>
                                this.props.navigation.navigate("ResendInvoice")
                              }
                            >
                              <Text style={{ color: "#000000" }}>
                                View Invoice
                              </Text>
                            </MenuOption>
                            <MenuOption
                              value={3}
                              disabled={true}
                              text="Three"
                            />
                          </MenuOptions>
                        </Menu>
                      </MenuProvider>
                    </TouchableOpacity> */}
                  </View>
                </View>
              ))}
        </Content>
        {this.state.loading && (
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
        )}
      </Container>
    );
  }
}

