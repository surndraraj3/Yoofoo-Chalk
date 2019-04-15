import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  AsyncStorage,
  TouchableHighlight,
  ImageBackground
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
  Fab
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import { getInventoryListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Inventory extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      active: "true",
      distributorId: "",
      authToken: "",
      inventoryList: [],
      inventoryCount: 0,
      searchInventoryList: [],
      isMounted: false
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    this._isMounted = true;
    if (this._isMounted) {
      await AsyncStorage.getItem("LoginDetails").then(resLoginDtls => {
        resLoginDtls = JSON.parse(resLoginDtls);
        //if (this._isMounted) {
        this.setState({
          distributorId: resLoginDtls.DistributorID,
          authToken: resLoginDtls.Token
        });
      });
      this.loadInventoryDetails();
    }
  };
  componentWillUnmount() {
    this._isMounted = false;    
  }
  //Load Inventory Details
  loadInventoryDetails = () => {   
    //Get Inventory List   
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
  //Search the inventory based on keyword match
  onSearchInventory = txtInventoryFld => {
    const rsSrchInvtry = this.state.inventoryList.filter(
      k =>
        k.ItemID.toLowerCase().includes(txtInventoryFld.toLowerCase()) ||
        k.Description.toLowerCase().includes(txtInventoryFld.toLowerCase())
      // k.Quantity.contains(txtInventoryFld)
    );
    this.setState({
      searchInventoryList: rsSrchInvtry,
      inventoryCount: rsSrchInvtry.length
    });
  };
  //Render FAB
  renderInventoryFloatingActionButton() {
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
        {/* <Icon name="shopping-cart" type="FontAwesome" style={{ fontSize:30}}/> */}
        <ImageBackground
          resizeMode={"stretch"} // or cover
          style={{
            height: "100%",
            width: "100%"
          }}
          source={require("../../assets/cart.png")}
        />
      </Fab>
    );
  }
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
            <Title>Items</Title>
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
              {this.state.inventoryCount} Items
            </Text>
            <View style={{ margin: 15 }}>
              <Item>
                <Input
                  placeholder="search items"
                  style={{
                    textAlign: "center",
                    height: 50,
                    // borderWidth: 2,
                    // borderColor: "#00e6e6",
                    // borderRadius: 20,
                    // backgroundColor: "#FFFFFF"
                  }}
                  onChangeText={this.onSearchInventory}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <ScrollView>
            {this.state.inventoryList.length === 0 ? (
              <Text style={commonStyles.warningMessage}>
                {" "}
                No records found !
              </Text>
            ) : (
              <View />
            )}
            {this.state.searchInventoryList.length === 0
              ? this.state.inventoryList.map((itm, i) => (
                  <View key={i}>
                    <Card>
                      <CardItem bordered>
                        <View style={commonStyles.row}>
                          <View style={{flexDirection: "column",width: 100, height: 50}}>
                            {/* <Icon
                              active
                              name="birthday-cake"
                              type="FontAwesome"
                              style={{ color: "#ff6666" }}
                            /> */}
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
                            <Text style={{ fontWeight: "bold" }}>
                              {itm.Description}
                            </Text>
                            <View style={commonStyles.nestedRow}>
                              <Text>SKU</Text>
                              <Text>{itm.ItemID}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Retail Price</Text>
                              <Text>{itm.RetailPrice}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Designer Price</Text>
                              <Text>{itm.Price}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Size </Text>
                              <Text>{itm.Quantity}</Text>
                              <Text>Count</Text>
                              <Text>{itm.Quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </CardItem>
                    </Card>
                  </View>
                ))
              : this.state.searchInventoryList.map((srchItm, srchIndx) => (
                  <View key={srchIndx}>
                    <Card>
                      <CardItem bordered>
                        <View style={commonStyles.row}>
                          <View style={{flexDirection: "column",width: 100, height: 50}}>                            
                            <Image
                              source={{ uri: `${srchItm.SmallPicture}` }}
                              style={{
                                height: 100,
                                width: "100%"
                                // borderRadius: 40 / 2
                              }}
                            />
                          </View>
                          <View style={commonStyles.column}>
                            <Text style={{ fontWeight: "bold" }}>
                              {srchItm.Description}
                            </Text>
                            <View style={commonStyles.nestedRow}>
                              <Text>SKU</Text>
                              <Text>{srchItm.ItemID}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Retail Price</Text>
                              <Text>{srchItm.RetailPrice}</Text>
                            </View>
                            <View style={commonStyles.nestedRow}>
                              <Text>Designer Price</Text>
                              <Text>{srchItm.Price}</Text>
                            </View>                            
                            <View style={commonStyles.nestedRow}>
                              <Text>Size </Text>
                              <Text>{srchItm.Quantity}</Text>
                              <Text>Count</Text>
                              <Text>{srchItm.Quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </CardItem>
                    </Card>
                  </View>
                ))}
          </ScrollView>
        </Content>
        {this.renderLoading()}
        {this.renderInventoryFloatingActionButton()}
      </Container>
    );
  }
}
