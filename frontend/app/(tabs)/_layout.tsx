import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAssets } from "expo-asset";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfilePictureCard from "../../components/cards/ProfilePictureCard";
export default () => {
  const logoSetting = (imgSrc, focused) => {
    if (focused) {
      if (imgSrc.toString().includes("home")) {
        console.log(imgSrc);
      }
    }

    // if (imgSrc !== "") {
    //   imgSrc = require(imgSrc);
    // }
    return (
      <View style={styles.logoContain}>
        {imgSrc !== "" && (
          <Image style={styles.logo} source={imgSrc} contentFit="cover" />
        )}
      </View>
    );
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              require("../../assets/navbarIcons/house.png"),
              params["focused"]
            ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              require("../../assets/navbarIcons/groups.png"),
              params["focused"]
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              require("../../assets/navbarIcons/profile.png"),
              params["focused"]
            ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      />
      <Tabs.Screen
        name="createGroup"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  logoContain: {
    width: 50,
    aspectRatio: 1,
    flex: 1,
  },
  logo: {
    flex: 1,
    width: "100%",
    borderRadius: 40,
  },
});
