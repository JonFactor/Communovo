import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GetUserDetailsApi,
  UpdateUserProfilePicApi,
  LoginUserApi,
  IUser,
  GetUserViaIdApi,
} from "../functions/Auth";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

import useSWR from "swr";

interface IAuthContextProps {
  loginViaCookies: (
    userTok?: string,
    sendToBackend?: boolean
  ) => Promise<boolean>;
  loginViaCredentials: (email: string, pass: string) => Promise<Response>;
  logout: (sendToBackend: boolean) => Promise<boolean>;
  isLoading: boolean;
  getUserInfo: () => Promise<IUser>;
  getUserProfilePhoto: (viadId: boolean, userId: string) => Promise<String>;
  setUserProfilePhoto: (image, userId?: number) => Promise<boolean>;
  isLoggedIn: () => Promise<boolean>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStopLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // useAuth: () => IAuthContextProps;
}

export const AuthContext = createContext<IAuthContextProps>(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [stopLoading, setStopLoading] = useState(false);

  const loginViaCredentials = async (
    email: string,
    pass: string
  ): Promise<Response> => {
    return await LoginUserApi(email, pass, false, "");
  };

  const loginViaCookies = async (
    userTok: string = null,
    sendToBackend: boolean = true
  ) => {
    setIsLoading(true);
    if (userTok === null) {
      userTok = await AsyncStorage.getItem("userToken");
    }
    setUserToken(userTok);

    AsyncStorage.setItem("userToken", userTok);

    if (sendToBackend) {
      const cookieResponse = await LoginUserApi("", "", true, userToken);
      const cookieIsValid = await isLoggedIn();

      if (!cookieResponse && !cookieIsValid) {
        setIsLoading(false);
        return false;
      }
    }
    setIsLoading(false);
    return true;
  };

  const logout = async (sendToBackend: boolean) => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    if (sendToBackend) {
      const responseOk: boolean = await LoginUserApi("", "", true, "");
      if (!responseOk) {
        setIsLoading(false);
        return false;
      }
    }

    setIsLoading(false);
    return true;
  };

  const isLoggedIn = async () => {
    setIsLoading(true);
    let userToken = await AsyncStorage.getItem("userToken");
    const loginOk = await LoginUserApi("", "", true, userToken);

    let success = false;
    if (loginOk) {
      success = true;
      setUserToken(userToken);
    }

    setIsLoading(false);
    return success;
  };

  const fetchImageFromUri = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  };

  const getUserProfilePhoto = async (
    viaId: boolean = false,
    userId: string = "0"
  ): Promise<string> => {
    setIsLoading(true);
    // check of already saved
    // if (userProfilePic !== null) {
    //   return userProfilePic;
    // }

    // check from storage
    let userPhotoUri;
    // check from db
    let userInfo;
    if (viaId) {
      userInfo = await GetUserViaIdApi(userId);
    } else {
      userInfo = await getUserInfo();
    }
    if (userInfo === null) {
      setIsLoading(false);
      return null;
    }

    userPhotoUri = userInfo.profilePic;
    if (userPhotoUri.includes("http:")) {
      setUserProfilePic(userPhotoUri);
      return userPhotoUri;
    }
    userPhotoUri = "profile/" + userPhotoUri;
    const photo: string = await Storage.get(userPhotoUri);

    setIsLoading(false);
    setUserProfilePic(photo);
    return photo;
  };

  const setUserProfilePhoto = async (image, userId: number = null) => {
    setIsLoading(true);
    const imageKey = uuidv4();

    const imgPath = "profile/" + imageKey;

    const img = await fetchImageFromUri(image["assets"][0]["uri"]);

    await Storage.put(imgPath, img, {
      level: "public",
      contentType: img.type,
    });

    let oldUser;
    if (userId === null) {
      const userInfo: IUser = await getUserInfo();
      if (userInfo === null) {
        setIsLoading(false);
        return false;
      }

      oldUser = userInfo.profilePic;
      userId = userInfo.id;

      const responseOk = await UpdateUserProfilePicApi(
        imageKey,
        userId.toString()
      );
      setIsLoading(false);
      return responseOk;
    }
    const userIdConvert: string = userId.toString();

    const responseSuccess = await UpdateUserProfilePicApi(
      imgPath,
      userIdConvert
    ).then((response) => {
      if (response && oldUser !== null) {
        // const removeSuccess = await Storage.remove(oldUser, {
        //   level: "public",
        // });
      }
      return response;
    });

    setIsLoading(false);
    return responseSuccess;
  };

  const getUserInfo = async (): Promise<IUser> => {
    setIsLoading(true);
    const response = await GetUserDetailsApi();
    setIsLoading(false);
    return response;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  // const useAuth: () => IAuthContextProps = () => {
  //   return useContext<IAuthContextProps>(AuthContext);
  // };

  return (
    <AuthContext.Provider
      value={{
        loginViaCookies,
        loginViaCredentials,
        logout,
        isLoading,
        getUserInfo,
        getUserProfilePhoto,
        setUserProfilePhoto,
        isLoggedIn,
        setIsLoading,
        setStopLoading,
        // useAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
