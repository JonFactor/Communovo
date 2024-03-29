import { View, Text, TextInput, Modal, Linking } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { AuthContext } from "../../../context/AuthContext";
import router from "../../../common/routerHook";
import AccountRecovery from "../../../components/modals/AccountRecovery";
import { Linker } from "../../../utils/Linker";
import { Router } from "@react-navigation/native";
import { useRouter } from "expo-router";
/*------------------------------------------------ Login Page ------
|
|  Purpose:  
|     - The barior / gate of the app to keep those milcious users out and keep
|       the average user in via creditials and jwt (json web tokens) (for backend)
|       letting the backend restrict the amount of requests accepted by a user and event
|       banning a user if needed,
|
|     - along with keeping the users data safe through standard
|       encrytion for all data and a doubly encryted password that is handled by the backends
|       built in encryption algorythm function that is maintained yearly. (keeping the data safe)
|
|  Main JS Sections:
|     - there are two main sections 2 ...
|      -- 1) logging in the user either through the stored authentication token or via
|          their own credentails (password, email) or both at the same time, just incase
|          an edgecase occurs.
|
|      -- 2) The other sections settup the use of this pages models of forgot password and
|          the sign up page for new users.
|
|  Main Html Sections:
|     - 2 sections ...
|      -- 1) the graphics are meant to create a homey / community feeling to the app
|           giving the user that saught after sence of community, what the app's main
|           purpose for creation is in a sociality plauged by chronic onlineness.
|
|      -- 2) the functional parts include the buttons to login, register, and reset password
|           along with an error text display for the login button for incorrect emails or passw0rds.
|
*-------------------------------------------------------------------*/

const LoginPage = () => {
  const { loginViaCookies, loginViaCredentials, getUserInfo } =
    useContext(AuthContext);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordResetModal, setPasswordResetModal] = useState(false);

  const validateUserEntry = () => {
    let emailErrored = true;
    if (!userEmail.includes("@") || userEmail.indexOf(" ") > -1) {
      setEmailError("invalid Email");
    } else if (userEmail.length < 1) {
      setEmailError("Email feild is required");
    } else {
      emailErrored = false;
      setEmailError("");
    }

    let passwordErrorer = true;
    if (userPassword.indexOf(" ") > -1) {
      setPasswordError("password must not include spaces");
    } else {
      passwordErrorer = false;
      setPasswordError("");
    }

    if (!passwordErrorer && !emailErrored) {
      return true;
    }
    return false;
  };

  const [displayPassword, setDisplayPassword] = useState(true);
  const [activeEyeIndex, setActiveEyeIndex] = useState(0);
  const eyeRoutes = [
    require("../../../assets/login/eye.svg"),
    require("../../../assets/login/eyeclosed.svg"),
  ];

  useEffect(() => {}, [displayPassword]);

  const router = useRouter();
  const handleSignInclick = async () => {
    const isValid = validateUserEntry();
    if (!isValid) {
      await loginViaCookies(null, true).then(
        async (response) => await getUserInfo()
      );
      const responseOk = await getUserInfo();
      if (responseOk) {
        Linker("/home");
        return;
      }
    }

    const email = userEmail;
    const password = userPassword;

    const response: Response = await loginViaCredentials(email, password);

    if (response === null) {
      setEmailError("Authoritization Failed, please try again");
      return;
    }

    const cookie = response["jwt"];

    loginViaCookies(cookie);

    Linker("/home");
  };

  const handleSignUpClick = () => {
    Linker("/register");
  };

  const handleForgotPasswordClick = () => {
    setPasswordResetModal(true);
  };

  return (
    <View className="mt-20">
      <Modal visible={passwordResetModal}>
        <AccountRecovery parentSetter={setPasswordResetModal} />
      </Modal>
      <View className=" p-4 ">
        <View className="flex items-center w-full mt-10">
          <Text className=" text-light-blue text-4xl font-semibold ">
            Communovo
          </Text>
        </View>
        <View className=" mt-16 flex items-center">
          <Text className="text-red-200 text-lg font-bold   ">
            {emailError}
          </Text>
          <View className=" flex-row space-x-4 mb-1">
            <View className=" w-9 h-12 flex">
              <Image
                source={require("../../../assets/login/person.svg")}
                contentFit="cover"
                className=" flex-1"
              />
            </View>
            <TextInput
              autoCapitalize="none"
              className="w-72 h-12 text-2xl"
              placeholder="Email"
              onChangeText={(text) => setUserEmail(text)}
              value={userEmail}
            ></TextInput>
          </View>
          <View className=" w-full h-1 bg-md-blue " />

          <View className=" mt-8">
            <Text className=" text-red-200 text-lg font-bold">
              {passwordError}
            </Text>
            <View className=" flex-row space-x-4 mb-1">
              <View className=" w-10 h-11 flex">
                <Image
                  source={require("../../../assets/login/lock.svg")}
                  contentFit="cover"
                  className=" flex-1"
                />
              </View>
              <TextInput
                className=" w-56 h-12 text-2xl"
                placeholder="Password"
                secureTextEntry={displayPassword}
                onChangeText={(text) => setUserPassword(text)}
                value={userPassword}
              ></TextInput>
              <TouchableOpacity
                className=" w-10 h-6 mt-5 flex"
                onPress={() => {
                  if (!displayPassword) {
                    setDisplayPassword(true);
                    setActiveEyeIndex(1);
                  } else {
                    setDisplayPassword(false);
                    setActiveEyeIndex(0);
                  }
                }}
              >
                <Image
                  source={eyeRoutes[activeEyeIndex]}
                  contentFit="cover"
                  className=" flex-1"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className=" w-full h-1 bg-md-blue" />
          <View className=" items-end w-full">
            <TouchableOpacity
              className=" mt-1"
              onPress={handleForgotPasswordClick}
            >
              <Text className=" text-gray-400">Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className=" items-center w-full space-y-4 mt-12">
          <TouchableOpacity
            className=" w-72 bg-md-blue items-center py-3"
            onPress={handleSignInclick}
          >
            <Text className=" text-white text-2xl">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" w-72 bg-dark-blue items-center py-3"
            onPress={handleSignUpClick}
          >
            <Text className="  text-white text-2xl">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className=" bg-white w-2 h-[4%]" />
      <View className=" flex w-full h-52">
        <Image
          source={require("../../../assets/login/bottomGraphic.svg")}
          contentFit="cover"
          className="flex-1"
        />
      </View>
    </View>
  );
};

export default LoginPage;
