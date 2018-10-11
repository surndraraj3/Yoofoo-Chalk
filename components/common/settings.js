import React from "react";
import { View, Dimensions } from "react-native";
import {
  Container,
  Content,
  Text,
  Icon,
  Label,
  Header,
  Body,
  Button,
  Left,
  Right,
  Title,
  Card,
  CardItem
} from "native-base";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class Settings extends React.Component {
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
            <Title>Settings</Title>
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
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>General</Text>
            </CardItem>
            <CardItem>
              <View style={commonStyles.rowData}>
                <Label>Default Zip</Label>
                <Label>84106</Label>
              </View>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
