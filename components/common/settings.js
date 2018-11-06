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
  Input,
  Left,
  Right,
  Title,
  Card,
  CardItem
} from "native-base";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorZipCode: false
    };
  }
  handleZipCode = valZipCode => {
    // console.log(`${valZipCode}`, '----', valZipCode.length);
    if (valZipCode.length === 5) {
      this.props.navigation.navigate("Home");
    } else {
      this.setState({ errorZipCode: true });
    }
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
            <Title>Settings</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
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
                <Left>
                  <Label>Default Zip</Label>
                </Left>
                <Input placeholder="84106" onChangeText={this.handleZipCode} />
                {/* <Right><Input placeholder="84106" onChangeText={this.handleZipCode} /></Right>  */}
              </View>
            </CardItem>
            {this.state.errorZipCode && (
              <Label style={commonStyles.errorMsg}>Incorrect Zip Code</Label>
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}
