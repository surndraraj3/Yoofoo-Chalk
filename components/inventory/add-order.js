import React from 'react';
import { View, Text } from 'react-native';
import {
    Container,
    Content,
    CheckBox,
    Icon,
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

export default class AddInventoryOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
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
                            onPress={() => this.props.navigation.navigate("InventoryOrder")}
                        >
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title> Add Order</Title>
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
                        <CardItem header>
                            <CheckBox checked={true} />
                            <Text style={{ fontWeight: "bold", margin: 10 }}> Chalklogy Paste</Text>
                        </CardItem>
                        <CardItem>
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
                                    <View style={commonStyles.nestedRow}>
                                        <Text>Qty Available </Text>
                                        <Text>1</Text>
                                    </View>
                                    <View style={commonStyles.nestedRow}>
                                        <Text>Discount </Text>
                                        <Text>20%</Text>
                                    </View>
                                    <View style={commonStyles.nestedRow}>
                                        <Text>Msrp </Text>
                                        <Text>
                                            {"\u0024"}
                                            10
                                        </Text>
                                    </View>
                                    <View style={commonStyles.nestedRow}>
                                        <Text>Designer</Text>
                                        <Text>
                                            {"\u0024"}
                                            4.59
                                        </Text>
                                    </View>
                                </View>
                                <View style={commonStyles.column}>
                                    <Right>
                                        <Icon
                                            name="plus"
                                            type="FontAwesome"
                                            style={{ color: "#f50" }}
                                        />
                                        <Text style={{ fontWeight: "bold" }}>
                                            0
                                        </Text>
                                        <Icon
                                            name="minus"
                                            type="FontAwesome"
                                            style={{ color: "#f50" }}
                                        />
                                    </Right>
                                </View>
                            </View>
                        </CardItem>
                    </Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
                        <Button bordered style={{ backgroundColor: "#00ffff" }}>
                            <Text
                                style={{
                                    color: "#000000",
                                    fontSize: 15,
                                    margin:10
                                }}
                            >
                                Cancel
                            </Text>
                        </Button>
                        <Button bordered style={{ backgroundColor: "#00ffff" }}>
                            <Text
                                style={{
                                    color: "#000000",
                                    fontSize: 20,   
                                    margin: 10                                 
                                }}
                            >
                                Checkout
                            </Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}