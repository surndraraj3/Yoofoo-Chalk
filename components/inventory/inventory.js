import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TextInput
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
  CardItem
} from "native-base";
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
      loading: true
    };
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
            <Title>Inventory</Title>
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
            {inventoryModel.map((itm, i) => (
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
                        <Text style={{ fontWeight: "bold" }}>{itm.title}</Text>
                        <Text>{itm.name}</Text>
                        <View style={commonStyles.nestedRow}>
                          <Text>Size </Text>
                          <Text>{itm.size}</Text>
                          <Text>Count</Text>
                          <Text>{itm.count}</Text>
                        </View>
                      </View>
                    </View>
                  </CardItem>
                </Card>
              </View>
            ))}
          </ScrollView>
          {this.renderLoading()}
        </Content>
      </Container>
    );
  }
}
