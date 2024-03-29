import { View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { RegisterUserApi } from "../../../functions/Auth";
import { Image } from "expo-image";
import { Linker } from "../../../utils/Linker";

/*----------------------------------------- Register User Page -------
|
|  Purpose:  
|     - Be the start of a users experince with communovo, setting themselves up with
|     success for staying on the app via the sunk cost falicy taking effect after the user
|     inputs all of their personal details without being too invasive.
|
|  Main JS Sections:
|     - Form submition is the only section in this page, consisting of a strict regex
|     password creation for security and email validation via regex (if contains . and @),
|     that will only redirect the user to the home screen and store cookies after the backend
|     successfully responds to the users request.
|
|  Main Html Sections:
|     - This page consits of the app title, user data entry text boxes, secure entries,
|     and the submit btn, along with error messages.
|  
|
*-------------------------------------------------------------------*/

const register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfrim, setPassConfrim] = useState("");

  const [nameErr, setNameErr] = useState("");
  const [usrNameErr, setUsrNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const validateUserEntry = () => {
    let hasErrors = false;

    const minNameLength = 2;
    const minUserNameLength = 6;

    const names = [firstName, lastName];

    names.forEach((value: string, index: number) => {
      if (value.length <= minNameLength) {
        setNameErr(`Name must be longer than ${minNameLength} chars`);
        hasErrors = true;
      } else {
        setNameErr("");
      }
    });

    if (userName.length <= minUserNameLength) {
      setUsrNameErr(`User name must be longer than ${minUserNameLength} chars`);
      hasErrors = true;
    } else if (userName.includes(" ")) {
      setUsrNameErr("No spaces are allowed in userName");
      hasErrors = true;
    } else {
      setUsrNameErr("");
    }

    const validEmail = new RegExp(
      "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );

    if (!validEmail.test(email)) {
      setEmailErr("Invalid Email");
      hasErrors = true;
    } else if (email.includes(" ")) {
      setEmailErr("Spaces not allowed in email");
      hasErrors = true;
    } else {
      setEmailErr("");
    }

    const validPassword = new RegExp(
      "^(?=.*?[A-Za-z!@#$%^&*])(?=.*?[0-9]).{5,}$"
    );

    if (!validPassword.test(password)) {
      setPassErr(
        "Password must be longer than 5 chars, and be included in the following: A-Z, a-z,!@#$%^&*, 0-9"
      );
      hasErrors = true;
    } else if (password.includes(" ")) {
      setPassErr("Spaces are not allowed in password");
      hasErrors = true;
    } else if (password !== passConfrim) {
      setPassErr("Password and Password confrimation do not match.");
      hasErrors = true;
    } else {
      setPassErr("");
    }

    if (hasErrors) {
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (!validateUserEntry()) {
      return;
    }

    const name = userName;
    const first = firstName;
    const last = lastName;

    const responseOk: boolean = await RegisterUserApi(
      name,
      email,
      password,
      first,
      last
    );

    console.log(responseOk);
    if (!responseOk) {
      setNameErr("Server request failed, please try again.");
      return;
    }

    Linker("/login");
  };
  return (
    <View className=" p-10">
      <View className=" flex-row mt-8">
        <TouchableOpacity
          onPress={() => {
            Linker("/login");
          }}
        >
          <View className=" flex h-6 w-5 ">
            <Image
              contentFit="cover"
              className="flex-1"
              source={require("../../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
        <Text className=" ml-10 text-4xl text-md-blue font-semibold">
          Communovo
        </Text>
      </View>
      <View className=" mt-8 space-y-10">
        <View>
          <Text className=" text-red-400">{nameErr}</Text>
          <View className="flex-row space-x-6">
            <View className=" w-36">
              <TextInput
                autoCapitalize="none"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
                placeholder={"First"}
                className=" text-2xl ml-2"
              />
              <View className=" w-full h-1 bg-md-purple" />
            </View>
            <View className=" w-36">
              <TextInput
                autoCapitalize="none"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                }}
                placeholder={"Last"}
                className=" text-2xl ml-2"
              />
              <View className=" w-full h-1 bg-md-purple" />
            </View>
          </View>
        </View>
        <View className=" mt-4">
          <Text className=" text-red-400">{usrNameErr}</Text>
          <View className=" flex-row">
            <View className=" flex w-9 h-12 ml-2 mb-1 ">
              <Image
                className=" flex-1 "
                contentFit="cover"
                source={require("../../../assets/login/person.svg")}
              />
            </View>
            <TextInput
              autoCapitalize="none"
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
              }}
              placeholder={"User Name"}
              className=" text-2xl ml-4"
            />
          </View>
          <View className=" w-full h-1 bg-md-purple" />
        </View>
        <View className=" mt-4">
          <View>
            <Text className=" text-red-400">{emailErr}</Text>
            <View className=" flex-row">
              <View className=" flex w-14 h-10">
                <Image
                  className=" flex-1 ml-2 mb-1"
                  contentFit="cover"
                  source={require("../../../assets/icons/mail.svg")}
                />
              </View>
              <TextInput
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                placeholder={"Email"}
                className=" text-2xl ml-4 mb-1"
              />
            </View>
            <View className=" w-full h-1 bg-md-purple" />
          </View>
        </View>
        <View className=" mt-4">
          <Text className=" text-red-400">{passErr}</Text>
          <View className=" flex-row">
            <View className=" flex h-11 w-10 ml-2 mb-1">
              <Image
                contentFit="cover"
                className=" flex-1"
                source={require("../../../assets/login/lock.svg")}
              />
            </View>
            <View className="bg-white w-1 h-2" />
            <TextInput
              autoCapitalize="none"
              secureTextEntry={false}
              className=" text-2xl ml-4"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              placeholder={"Password"}
            />
          </View>
          <View className=" w-full h-1 bg-md-purple" />
        </View>
        <View className=" mt-4">
          <Text className=" text-red-400">{passErr}</Text>
          <View className=" flex-row">
            <View className=" flex h-11 w-12 ml-2 mb-1">
              <Image
                contentFit="cover"
                className=" flex-1"
                source={require("../../../assets/icons/double-lock.svg")}
              />
            </View>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={false}
              className=" text-2xl ml-4"
              value={passConfrim}
              onChangeText={(text) => {
                setPassConfrim(text);
              }}
              placeholder={"Confirm Password"}
            />
          </View>
          <View className=" w-full h-1 bg-md-purple" />
        </View>
      </View>
      <View className=" w-full items-center mt-12">
        <TouchableOpacity
          onPress={submitForm}
          className=" bg-md-blue w-64 h-14 items-center"
        >
          <Text className=" text-white text-2xl mt-3 ">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default register;
