import React from "react";
import store from '../store/store';
import {
  Text,
  View,
  UIManager,
  findNodeHandle,
  ActivityIndicator,
  AsyncStorage,
  ImageBackground,
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
  Input,
  Fab
} from "native-base";
import OptionsMenu from "react-native-options-menu";
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
      language: "",
      active: false
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    var newState = store.getState();
   
      await this.setState({
        authToken: newState.tokenReducer.loginInfo.tokenKey,
        distributorId: newState.tokenReducer.loginInfo.distributorKey,
      });
   
    // await AsyncStorage.getItem("LoginDetails")
    //   .then(responseJson => {
    //     responseJson = JSON.parse(responseJson);
    //     this.setState({
    //       distributorId: responseJson.DistributorID,
    //       authToken: responseJson.Token
    //     });
    //   });
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
    UIManager.showPopupMenu(
      findNodeHandle(this._button),
      ["Open", "Ressend"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        //console.log(`${e} : ${i}`);
        if (i === 0) {
          this.props.navigation.navigate("TransferOrder", {
            customerId: openMenuid
          });
        } else {
          //console.log(`${e} : ${i}`);
        }
      }
    );
  };
  //Show Floating Button
  renderFloatingActionButton() {
    return (
      <Fab
        active={this.state.active}
        direction="up"
        containerStyle={{}}
        style={{
          backgroundColor: "#4d4d4d",
          position: "absolute",
          right: 0,
          bottom: 0
        }}
        position="bottomRight"
        onPress={() => this.props.navigation.navigate("InventoryOrder")}
      >
        {/* <Icon name="folder-open" type="FontAwesome" style={{ fontSize:30}}/> */}
        <ImageBackground
          resizeMode={"stretch"} // or cover
          style={{
            height: "100%",
            width: "100%"
          }}
          source={require("../../assets/cart.png")}
        />
        {/* <ImageBackground
          resizeMode={"stretch"} // or cover
          style={{
            height: 40,
            width: 40
          }}
          source={require("../../assets/start.png")}
        />
        <Button
          style={{ backgroundColor: "#34A34F" }}
          onPress={() => this.props.navigation.navigate("InventoryOrder")}
        >
          <Image
            source={require("../../assets/cart.png")}
            style={{
              height: 40,
              width: 40,
              borderRadius: 40 / 2
            }}
          />
        </Button> */}
      </Fab>
    );
  }
  // Filter by text box search
  onChangeOrder = txtSrchFild => {
    const res = this.state.dataSource.filter(
      v =>
        v.Customer.toLowerCase().includes(txtSrchFild.toLowerCase()) ||
        v.OrderDate.includes(txtSrchFild) ||
        v.OrderNum.includes(txtSrchFild)
      //
    );
    this.setState({ searchOrdersList: res, orderCount: res.length });
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

  render() {
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
            <Title>Orders</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
            </Button>
            {/* <Button transparent>
              <Icon name="more" />
            </Button> */}
            <TouchableHighlight
              style={{
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40
              }}
            >
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
            <Text style={{ margin: 10, fontSize: 12 }}>
              {this.state.orderCount} Order
            </Text>
            <View style={{ margin: 15}}>
              <Item>
                <Input
                  placeholder="Order Number, Name or DesignerID"
                  style={{
                    textAlign: "center",
                    height: 50,
                    // borderWidth: 2,
                    // borderColor: "#00e6e6",
                    // borderRadius: 20,
                    // backgroundColor: "#FFFFFF"
                  }}
                  onChangeText={this.onChangeOrder}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <View style={commonStyles.ordersRow}>
            <Text>Customer</Text>
            <Text>Order Date</Text>
            <Text>Order # </Text>
            {/* <Text /> */}
          </View>
          <Text style={commonStyles.warningMessage}>
            {this.state.orderCount === 0 ? "No Orders Found" : ""}
          </Text>
          {this.state.searchOrdersList.length === 0
            ? this.state.dataSource.map((orderItem, indx) => (
                <View key={indx}>
                  <Text style={commonStyles.warningMessage}>
                    {orderItem.length === 0 ? "No Orders Found" : ""}
                  </Text>
                  <View style={commonStyles.ordersRow}>
                    <Text>{orderItem.Customer.trim()}</Text>
                    <Text>{orderItem.OrderDate.trim()}</Text>
                    <TouchableHighlight
                      onPress={() =>
                        this.props.navigation.navigate("ResendInvoice", {
                          OrderNumber: orderItem.OrderNum
                        })
                      }
                    >
                      <Text>{orderItem.OrderNum.trim()}</Text>
                    </TouchableHighlight>                    
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
                    <TouchableHighlight
                      onPress={() =>
                        this.props.navigation.navigate("ResendInvoice")
                      }
                    >
                      <Text>{orderItem.OrderNum}</Text>
                    </TouchableHighlight>
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
            }}
          />
        )}
        {this.renderFloatingActionButton()}
      </Container>
    );
  }
}
