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
  Left,
  Right,
  Title
} from "native-base";
import commonStyles from "../styles/styles";

export default class Transfer extends React.Component {
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
            <Title>Transfer</Title>
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
          <Form>
            <Label style={commonStyles.labelPos}>Welcome To Transfer Page</Label>
          </Form>
        </Content>
      </Container>
    );
  }
}
