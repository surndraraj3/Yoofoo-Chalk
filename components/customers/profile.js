import React from "react";
import { Text, View } from "react-native";
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
  Left, Right, Title
} from "native-base";
import commonStyles from "../styles/styles";

export default class CustomerProfile extends React.Component {
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        {/* <Button full>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        </Button> */}
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("Customer")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
          <Button transparent>
              <Icon name='home' />
            </Button>
            <Button transparent>
              <Icon name='more' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Label style={commonStyles.labelPos}>Designer Id</Label>
            <Item>
              <Input disabled placeholder="12345" />
            </Item>
            <Label style={commonStyles.labelPos}>First Name</Label>
            <Item>
              <Input disabled placeholder="Jane" />
            </Item>
            <Label style={commonStyles.labelPos}>Last Name</Label>
            <Item>
              <Input disabled placeholder="smith" />
            </Item>
            <Label style={commonStyles.labelPos}>Phone Number</Label>
            <Item>
              <Input disabled placeholder="(619)255-2555" />
            </Item>
            <Label style={commonStyles.labelPos}>Email</Label>
            <Item>
              <Input disabled placeholder="jsmith@email.com" />
            </Item>
            {/* <View style={commonStyles.buttonCommonMargin}>
              <Button block>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit</Text>
              </Button>
            </View> */}
          </Form>
        </Content>
      </Container>
    );
  }
}
