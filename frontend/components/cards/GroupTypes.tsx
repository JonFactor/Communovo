import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { TouchableHighlight } from "react-native-gesture-handler";

const GroupTypes = ({ color, scale, title, logo, gradient }) => {
  // color -> backround color | size -> scaleing | title -> text | logo -> path | gradient -> bool

  const handleGroupPress = () => {
    router.push(`/groups/${title}`);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleGroupPress}
        style={[
          styles.container,
          { backgroundColor: color },
          { height: scale * 70 },
        ]}
      >
        <View>
          <Text style={styles.content}>{title}</Text>
          <View style={styles.logo}>
            <Image
              source={"https://picsum.photos/200/300"}
              contentFit="fill"
            ></Image>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 5,
  },
  content: {
    color: "black",
    fontWeight: "600",
    fontSize: 24,
    marginTop: 20,
    marginLeft: 10,
  },
  logo: {
    width: 50,
    height: 70,
    display: "flex",
  },
});

export default GroupTypes;
