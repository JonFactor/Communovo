import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GetUserDetailsApi,
  UpdateUserProfilePicApi,
  LoginUserApi,
  IUser,
  GetUserViaIdApi,
} from "../functions/Auth";

import { v4 as uuidv4 } from "uuid";
import { fetchImageFromUri } from "../common/fetchImageFromUri";
import { useAsync } from '@react-hookz/web';

/*------------------------------------------------- AUTH_CONTEXT -----
  |
  |  What?: 
  |   - Context: a context in the react js / expo js world is in basic terms
  |              an element that encapsulates the whole program providing pros and cons,
  |              pros being the ease of importing these functions becasuse they are already
  |              in memory, while cons being they are always in memory but for this generation
  |              of devices this should not pose any issues. 
  |
  |   - AUTH: auth or authentication is used for user actions and db actions, outside of login
  |           you need to be auth'ed to proform any api calls, this auth or auth token (jwt)
  |           is used to store your app session details to the backend api.
  |
  |  How ?:   by declaring a useContext hook inside of the page that uses these functions
  |           these funcion pointers can be used (for name scoping reasons). Along with 
  |           the Auth.provider element being used above the scope of the app navigator.
  |
  |  Purpose:  Provide an easily accesible and centeralized location for all of the auth
  |            needs of any user, with pleanty of functions for any need.
  |
  |  Main Functions: 
  |          - LOGIN (gate opener)
  |           either via the stored cookie or credentials (pass, email) the login functions
  |           accoplish the same goal of user authentication access.
  |           
  |          - LOGOUT (gate close)
  |           set the user token to nothing and redirect them to the login screen effectivly
  |           dening the user access to the appl
  |           
  |          - USER_INFO (messanger)
  |           get the users own information in a typed response if they have valid credentials,
  |           or get another users information provided their account id.
  |           
  |          - USER_PROFILE_PHOTO (camera)
  |           set or get this accounts photo given they have proper credentials and set
  |           the aws s3 instance key in the users row in the db, along with viewing other
  |           users profile pictures.
  |           
  |          - IS_LOGGED_IN (gate keeper)
  |           send a get user details request to the server and if the server says
  |           that you are not authenticated then a boolean of the value of false is retruned
  |           along with the opposite for successfull requests.
  |
  |          - LOADING (gate downtime)
  |           let the app know when it is waiting for the backend to response, wether
  |           this downtime is caused by server or user side latency.
  |
  *-------------------------------------------------------------------*/

interface IAuthContextProps {
  authenticated: boolean;
  session: {
    create: (token: string) => boolean;
    end: () => boolean;
  };
  user: IUser;
}

const getProfile = async () => {
  return await GetUserDetailsApi();
}

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthContext = createContext<IAuthContextProps>(
  {
    authenticated: false,
    session: {
      create: (token: string) => false,
      end: () => false,
    },
    user: null
  }
);

export const AuthProvider = ({ children }) => {

  const [authenticated, setAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<IUser>(null)

    // api call
  const [profileState, profileActions] = useAsync(getProfile)

  // update profile
  useEffect(() => {
    if (profileState.status === "success" && profileState.result) {
      setUser(profileState.result)
      setAuthenticated(true)
    }
  }, [profileState, mounted, authenticated])

  // initial check
  useEffect(() => {
    if (profileState.status === 'not-executed' || !mounted) {
      profileActions.execute()
      setMounted(true)
    }
  }, [])

  // update authenticated
  useEffect(() => {
    if (profileState.status === "success" && profileState.result) {
      setAuthenticated(true)
    }
    if (profileState.error) {
      setAuthenticated(false)
    }
  }, [profileState.result, profileState.status])

  // create session
  const createSession = (token:string) => {
    profileActions.execute()
    AsyncStorage.setItem("userToken", token)
    LoginUserApi("", "", true, token, false)
    return true
  }

  // end session
  const endSession = () => {
    profileActions.reset()
    AsyncStorage.setItem("userToken", "")
    LoginUserApi("", "", true, "", false)
    return true
  }




  // const loginViaCredentials = async (
  //   email: string,
  //   pass: string
  // ): Promise<any> => {
  //   return await LoginUserApi(email, pass, false, "", true);
  // };

  // const loginViaCookies = async (
  //   userTok: string = null,
  //   sendToBackend: boolean = true
  // ) => {
  //   setIsLoading(true);
  //   if (userTok === null) {
  //     userTok = await AsyncStorage.getItem("userToken");
  //   }
  //   setUserToken(userTok);

  //   AsyncStorage.setItem("userToken", userTok);

  //   if (sendToBackend) {
  //     const cookieResponse = await LoginUserApi("", "", true, userToken);
  //     const cookieIsValid = await isLoggedIn();

  //     if (!cookieResponse && !cookieIsValid) {
  //       setIsLoading(false);
  //       return false;
  //     }
  //   }
  //   setIsLoading(false);
  //   return true;
  // };

  // const logout = async (sendToBackend: boolean) => {
  //   setIsLoading(true);
  //   setUserToken(null);
  //   AsyncStorage.removeItem("userToken");
  //   if (sendToBackend) {
  //     const responseOk: boolean = await LoginUserApi("", "", true, "");
  //     if (!responseOk) {
  //       setIsLoading(false);
  //       return false;
  //     }
  //   }

  //   setIsLoading(false);
  //   return true;
  // };

  // const isLoggedIn = async () => {
  //   setIsLoading(true);
  //   let userToken = await AsyncStorage.getItem("userToken");
  //   const loginOk = await LoginUserApi("", "", true, userToken);

  //   let success = false;
  //   if (loginOk) {
  //     success = true;
  //     setUserToken(userToken);
  //   }

  //   setIsLoading(false);
  //   return success;
  // };

  // const getUserInfo = async (): Promise<IUser> => {
  //   setIsLoading(true);
  //   const response = await GetUserDetailsApi();
  //   setIsLoading(false);
  //   return response;
  // };

  // useEffect(() => {
  //   isLoggedIn();
  // }, []);

  const value = {
    authenticated: authenticated,
    session: {
      create: createSession,
      end: endSession
    },
    user: null
  }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};
