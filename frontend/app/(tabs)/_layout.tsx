import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default () => {
  const logoSetting = (imgSrc: string, focused) => {
    let imageSource;
    if (imgSrc.includes("house")) {
      if (focused) {
        imageSource = require("../../assets/navbarIcons/houseFilled.svg");
      } else {
        imageSource = require("../../assets/navbarIcons/houseUnfilled.svg");
      }
    } else if (imgSrc.includes("groups")) {
      if (focused) {
        imageSource = require("../../assets/navbarIcons/discoverFilled.svg");
      } else {
        imageSource = require("../../assets/navbarIcons/discoverUnfilled.svg");
      }
    } else if (imgSrc.includes("profile")) {
      if (focused) {
        imageSource = require("../../assets/navbarIcons/profileFilled.svg");
      } else {
        imageSource = require("../../assets/navbarIcons/profileUnfilled.svg");
      }
    }
    // const imageSource = require(imgSrc.toString());
    // if (imgSrc !== "") {
    //   imgSrc = require(imgSrc);
    // }
    return (
      <View style={styles.mainContain}>
        {/* <View style={styles.logoAbove}></View> */}
        <View style={styles.logoContain}>
          {imgSrc !== "" && (
            <Image style={styles.logo} source={imageSource} contentFit="fill" />
          )}
        </View>
      </View>
    );
  };

  const HomeScreen = () => {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={styles.wholeContain}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              "../../assets/navbarIcons/house.png",
              params["focused"]
            ),
          tabBarStyle: {
            height: 90,
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}

        // compon
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              "../../assets/navbarIcons/groups.png",
              params["focused"]
            ),
          tabBarStyle: {
            height: 90,
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: (params) =>
            logoSetting(
              "../../assets/navbarIcons/profile.png",
              params["focused"]
            ),
          tabBarStyle: {
            height: 90,
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
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
    width: 90,
    aspectRatio: 1,
    flex: 1,
  },
  logo: {
    flex: 1,
    width: "100%",
  },
  logoAbove: {
    width: 42,
    height: 8,
    backgroundColor: "#C8B6FF",
    borderRadius: 90,
  },
  mainContain: {
    flex: 1,
    marginTop: 2,
  },
  wholeContain: {
    flex: 1,
  },
});
