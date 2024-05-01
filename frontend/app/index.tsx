import { Redirect } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
//import "../app.js";
import { AuthContext } from "../context/AuthContext";

import { Amplify } from "aws-amplify";
// import awsmobile from "../src/aws-exports.js";
// Amplify.configure(awsmobile);

/*------------------------------------------------ Start Page -------
|
|  Purpose:  
|     - Direct the user to the page they need to be on wether that be the login or home page,
|     for the auto-login feature.
|
|  Main JS Sections:
|     - utilizing auth contexts functions to test if the user should be automatically loggedin
|
|  Main Html Sections:
|     - REDIRECTS are used to do what the name says and goto the different paths of the app
|       mostly used for auto-user login when their token has not expired. 
|  
|
*-------------------------------------------------------------------*/

const StartPage = () => {
  const { isLoading, isLoggedIn } = useContext(AuthContext);
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
