import React from "react";
import { View, Text, Switch, ScrollView } from "react-native";
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
  TitleCard,
  Title,
  CardItem,
  Card
} from "native-base";
import commonStyles from "../styles/styles";

export default class AddCutsomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valBillingAddress: false
    };
  }
  onBillingAddressChange = itm => {
    // console.log("itm", itm);
    if (itm) this.setState({ valBillingAddress: true });
    else this.setState({ valBillingAddress: false });
  };
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Customer")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Add Customer</Title>
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
          <ScrollView>
            <Card>
              <CardItem>
                <Item stackedLabel>
                  <Label>Email</Label>
                  <Input />
                </Item>
              </CardItem>
              <CardItem>
                <Item stackedLabel>
                  <Label>First Name</Label>
                  <Input />
                </Item>
              </CardItem>
              <CardItem>
                <Item stackedLabel>
                  <Label>Last Name</Label>
                  <Input />
                </Item>
              </CardItem>
              <CardItem>
                <Item stackedLabel>
                  <Label>Phone Number</Label>
                  <Input />
                </Item>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Left>
                  <Label>Billing Address</Label>
                </Left>
                <Right>
                  <Switch
                    value={this.state.valBillingAddress}
                    onValueChange={this.onBillingAddressChange}
                  />
                  {/* <Switch 
                    onValueChange={(this.state.valBillingAddress) ? this.setState({ valBillingAddress: true }) : this.setState({ valBillingAddress: false })}
                    value={this.state.valBillingAddress} 
                    />  */}
                </Right>
              </CardItem>
              {this.state.valBillingAddress && (
                <View>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>Street</Label>
                      <Input />
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>City</Label>
                      <Input />
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>State</Label>
                      <Input />
                    </Item>
                  </CardItem>
                  <CardItem>
                    <Item stackedLabel>
                      <Label>Zip</Label>
                      <Input />
                    </Item>
                  </CardItem>
                </View>
              )}
            </Card>
            <View style={commonStyles.buttonPos}>
              <Text
                style={{ color: "#42f4f1", fontSize: 20, fontWeight: "bold" }}
              >
                Save
              </Text>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
