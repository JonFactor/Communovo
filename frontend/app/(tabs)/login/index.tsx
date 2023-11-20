import { View, Text, TextInput, StyleSheet, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "react-native-elements";
import LoginForm from "../../../components/forms/LoginForm";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { AuthContext } from "../../../context/AuthContext";
import router from "../../../common/routerHook";
import AccountRecovery from "../../../components/modals/AccountRecovery";

const LoginPage = () => {
  const { loginViaCookies, loginViaCredentials, getUserInfo } =
    useContext(AuthContext);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0);
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

  const handleSignInclick = async () => {
    const isValid = validateUserEntry();
    if (!isValid) {
      await loginViaCookies(null, true).then(
        async (response) => await getUserInfo()
      );
      const responseOk = await getUserInfo();
      if (responseOk) {
        router.back();
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

    const cookie = response["data"]["jwt"];

    loginViaCookies(cookie);

    router.back();
  };

  const handleSignUpClick = () => {
    router.replace("/register");
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
            Communivo
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
              className="w-72 h-12 text-3xl"
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
                className=" w-56 h-12 text-3xl"
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
