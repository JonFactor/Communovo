import { View } from "react-native";
import React from "react";
import { Link } from "expo-router";

// this page sets what happens when the user redirects to a page that is not avalible / real
// redirecting them to the home page. where if the user is not yet logged in the home page will
// redirect the user to the login screen via home pages redirect in the useeffect hook.
const PageNotFound = () => {
  return (
    <View>
      <Link href={"/home"} />
    </View>
  );
};

export default PageNotFound;
