import React from "react";
import { View } from "react-native";
import { Card, Text, Avatar } from "react-native-elements";

const PostCard = (props) => {

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          height:8,
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "#ffab91" }}
          rounded
          icon={{ name: "user", type: "font-awesome", color: "black" }}
          activeOpacity={1}
        />
        <Text h4Style={{ padding: 10 }} h4>
          {props.author}
        </Text>
      </View>
      <Text style={{ fontStyle: "italic" }}> {props.title}</Text>
      <Text
        style={{
          paddingVertical: 10,
        }}
      >
        {props.body}
      </Text>
    </Card>
  );
};

export default PostCard;