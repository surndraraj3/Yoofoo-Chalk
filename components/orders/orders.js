import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
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
  Title
} from "native-base";
import commonStyles from "../styles/styles";

export default class Orders extends React.Component {  
  onOpenMenu = (openMenuid) => {
    console.log('Ids', openMenuid);
    UIManager.showPopupMenu(
      findNodeHandle(this._button),
      ['Open', 'Ressend'],
      () => console.log('something went wrong with the popup menu'),
      (e, i) => {
        console.log(`${e} : ${i}`);
        if(i === 0) {
          this.props.navigation.navigate("TransferOrder", { customerId: openMenuid })
        } else {
          console.log(`${e} : ${i}`);
        }
      }
    );
  };
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
          <View style={commonStyles.row}>
            <Text>Order#</Text>
            <Text>Order Date</Text>
            <Text>Customer</Text>
            <Text>Action</Text>
          </View>
          <View style={commonStyles.row}>
            <Text>11</Text>
            <Text>7/12/2018</Text>
            <Text>Lisa Barton</Text>                       
            <TouchableOpacity
              ref={e => {this._button = e;}}
              onPress={() => this.onOpenMenu('261')}
              style={commonStyles.iconCircle}
            >
              <Icon name="ellipsis-h" type="FontAwesome" style={{fontSize: 20, color: '#55e6f6'}}/>
            </TouchableOpacity>    
          </View>
        </Content>
      </Container>
    );
  }
}