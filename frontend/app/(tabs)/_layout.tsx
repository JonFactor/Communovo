import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

/*--------------------------------------- Bottom Nav Function -------
|
|  Purpose:  
|     - provide a dynamic, minimistic, and quickly accessable ui for page navigation.
|
|  Main JS Sections:
|     - logoSetting provides the svg for the correct tab, with another layer of conditions
|     to check if the page that they have selected / currently on is this tab and changing the 
|     tab icon baised on this.
|
|  Main Html Sections:
|     - TAB_BAR_STYLE_NONE -> this allows the tabs to be routed to while not being displayed
|                             in the built in bottom navbar.
|
|     - DISPLAYED_TAB_BARS -> utilizing the logoSetting function these tabs are dynamically
|                            loaded for the icons, while being as simple and intuitve to the user
|                            as humanly possible, using the industry standard practices for social media apps.
|
*-------------------------------------------------------------------*/

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
    return (
      <View style={styles.mainContain}>
        <View style={styles.logoContain}>
          {imgSrc !== "" && (
            <Image style={styles.logo} source={imageSource} contentFit="fill" />
          )}
        </View>
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
