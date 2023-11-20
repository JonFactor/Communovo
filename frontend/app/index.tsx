import { Redirect, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "../app.js";
import { AuthContext } from "../context/AuthContext.js";

import { Amplify } from "aws-amplify";
import awsmobile from "../src/aws-exports.js";
Amplify.configure(awsmobile);

const StartPage = () => {
  const { isLoading, userToken, getUserInfo, isLoggedIn } =
    useContext(AuthContext);
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const cookieIsNotExpired = async () => {
      const result = await isLoggedIn();
      setIsExpired(!result);
    };
    cookieIsNotExpired();
  }, []);

  return (
    <View>
      {isLoading ? (
        <View className=" flex-1 justify-items-center align-middle w-screen h-screen">
          <ActivityIndicator size={"large"} className=" mt-72   " />
        </View>
      ) : (
        <View>
          {isExpired ? (
            <Redirect href={"/login"} />
          ) : (
            <Redirect href={"/home"} />
          )}
        </View>
      )}
    </View>
  );
};

export default StartPage;
