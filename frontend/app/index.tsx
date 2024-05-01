import { Redirect } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
//import "../app.js";
import { AuthContext, useAuth } from "../context/AuthContext";

import { Amplify } from "aws-amplify";
import awsmobile from './aws-exports.js';
Amplify.configure(awsmobile);

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
  const { authenticated } = useAuth();
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const cookieIsNotExpired = async () => {
      setIsExpired(!authenticated);
    };
    cookieIsNotExpired();
  }, []);

  return (
    <View>
        <View>
          {isExpired ? (
            <Redirect href={"/login"} />
          ) : (
            <Redirect href={"/home"} />
          )}
        </View>
    </View>
  );
};

export default StartPage;
