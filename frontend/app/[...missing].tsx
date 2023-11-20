import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const PageNotFound = () => {
  return (
    <View>
      <Link href={"/home"} />
    </View>
  );
};

export default PageNotFound;
