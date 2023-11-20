import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserGetDetails,
  UserUpdateProfile,
  UserLoginViaCookies,
  IUser,
  UserLogin,
} from "../functions/Auth";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

import useSWR from "swr";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [stopLoading, setStopLoading] = useState(false);

  const loginViaCredentials = async (
    email: string,
    pass: string
  ): Promise<Response> => {
    return await UserLogin(email, pass);
  };

  const loginViaCookies = async (
    userTok: string = null,
    sendToBackend: boolean = true
  ): Promise<boolean> => {
    setIsLoading(true);
    if (userTok === null) {
      userTok = await AsyncStorage.getItem("userToken");
    }
    setUserToken(userTok);

    AsyncStorage.setItem("userToken", userTok);

    if (sendToBackend) {
      const cookieResponse = await UserLoginViaCookies(userToken);
      const cookieIsValid = await isLoggedIn();

      if (!cookieResponse && !cookieIsValid) {
        setIsLoading(false);
        return false;
      }
    }
    setIsLoading(false);
    return true;
  };

  const logout = async (sendToBackend: boolean): Promise<boolean> => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    if (sendToBackend) {
      const responseOk: boolean = await UserLoginViaCookies("");
      if (!responseOk) {
        setIsLoading(false);
        return false;
      }
    }

    setIsLoading(false);
    return true;
  };

  const isLoggedIn = async (): Promise<boolean> => {
    setIsLoading(true);
    let userToken = await AsyncStorage.getItem("userToken");
    const loginOk = await UserLoginViaCookies(userToken);

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

  const getUserProfilePhoto = async (): Promise<string> => {
    setIsLoading(true);
    // check of already saved
    if (userProfilePic !== null) {
      return userProfilePic;
    }

    // check from storage
    let userPhotoUri;
    // check from db
    const userInfo = await getUserInfo();
    if (userInfo === null) {
      setIsLoading(false);
      return null;
    }

    userPhotoUri = userInfo.profilePic;

    if (
      userPhotoUri.includes("h") &&
      userPhotoUri.includes("t") &&
      userPhotoUri.includes("t") &&
      userPhotoUri.includes("p")
    ) {
      setUserProfilePic(userPhotoUri);
      return userPhotoUri;
    }

    const photo: string = await Storage.get(userPhotoUri);

    setIsLoading(false);
    setUserProfilePic(photo);
    return photo;
  };

  const setUserProfilePhoto = async (
    image: String,
    userId: number = null
  ): Promise<boolean> => {
    setIsLoading(true);
    const imageKey = uuidv4();
    const imgPath = "profile/" + imageKey;

    const img = await fetchImageFromUri(image["assets"][0]["uri"]);

    const imageStoreageResult = await Storage.put(imgPath, img, {
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
    }

    const userIdConvert: string = userId.toString();

    const responseSuccess = await UserUpdateProfile(
      imgPath,
      userIdConvert
    ).then((response) => {
      if (response && oldUser !== null) {
        console.log("12");
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
    if (stopLoading) {
      console.log("1234");
      return null;
    }
    setIsLoading(true);
    const response = await UserGetDetails();
    setIsLoading(false);
    return response;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
