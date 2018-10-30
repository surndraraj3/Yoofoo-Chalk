import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  AsyncStorage,
  Image
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
  Fab
} from "native-base";
import { getInventoryListURL } from '../common/url_config';
import commonStyles from "../styles/styles";

const inventoryModel = [
  {
    inventoryId: 1,
    distributorId: 100,
    customerId: 1,
    name: "Chalk",
    imageUrl: "",
    count: 12,
    size: 5,
    title: "Couture"
  },
  {
    inventoryId: 2,
    distributorId: 100,
    customerId: 1,
    name: "Chalklogy Paste",
    imageUrl: "",
    count: 12,
    size: 5,
    title: "Chalklogy Paste"
  },
  {
    inventoryId: 3,
    distributorId: 100,
    customerId: 1,
    name: "Pastry",
    imageUrl: "",
    count: 12,
    size: 5,
    title: "Pastry"
  },
  {
    inventoryId: 4,
    distributorId: 100,
    customerId: 1,
    name: "Cookie Butter",
    imageUrl: "",
    count: 12,
    size: 5,
    title: "Cookie"
  },
  {
    inventoryId: 5,
    distributorId: 100,
    customerId: 1,
    name: "Cookie",
    imageUrl: "",
    count: 12,
    size: 5,
    title: "Cookie"
  }
];
export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      active: "true",
      distributorId: "",
      authToken:"",
      inventoryList: [],
      inventoryCount: 0
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    await AsyncStorage.getItem('LoginDetails')
    .then(resLoginDtls => {
      resLoginDtls = JSON.parse(resLoginDtls)
      this.setState({ distributorId: resLoginDtls.DistributorID, authToken: resLoginDtls.Token })
    })
    //Get Inventory List
    fetch(`${getInventoryListURL}${this.state.distributorId}`, {
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.authToken}`
      }
    })
    .then(response => response.json())
    .then(responseJson => {
      //console.log(responseJson);
      this.setState({
        inventoryList: responseJson,
        inventoryCount: responseJson.length
      });      
      this.setState({ loading: false });
    })
    .catch(error => {
      console.error(error);
      this.setState({ loading: false });
    });
  }
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
  //Render FAB
  renderInventoryFloatingActionButton(){
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
        onPress={() => this.setState({ active: !this.state.active })}
      >
        <Icon name="sun-o" type="FontAwesome" />
        <Button
          style={{ backgroundColor: "#34A34F" }}
          // onPress={() => this.props.navigation.navigate("AddCutsomer")}
        >
          <Image
            source={require("../../assets/new_customer.png")}
            style={{
              height: 40,
              width: 40,
              borderRadius: 40 / 2
            }}
          />
        </Button>
      </Fab>
    );
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
            <Title>{this.state.inventoryCount} Inventory</Title>
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
            <Text style={{ margin: 15, fontSize: 20 }}> Inventory</Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item rounded>
                <Input
                  placeholder="Search Inventory"
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
