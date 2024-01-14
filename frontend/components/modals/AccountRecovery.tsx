import { View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { GetPasswordResetCodeApi, SendEmailApi } from "../../functions/Auth";

interface IAccountRecoveryParams {
  parentSetter: (param) => void;
}

const AccountRecovery = ({ parentSetter }: IAccountRecoveryParams) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailBtnEnabled, setEmailBtnEnabled] = useState(true);
  const [emailBtnTxt, setEmailBtnTxt] = useState("Send Email");
  const [codeVerificationSectionVisible, setCodeVerificationSectionVisible] =
    useState(false);
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [codeSectionMessage, setCodesectionMessage] = useState("");
  const [codeSectionError, setCodeSectionError] = useState(false);

  const validateEntry = () => {
    if (!email.includes("@") || email.indexOf(" ") > -1) {
      setErrorMessage("Invalid Email");
      return false;
    } else if (!emailBtnEnabled) {
      setErrorMessage("Email requested before timeout was over");
    }
    setErrorMessage("");
    return true;
  };

  const sendRequest = () => {
    const validated = validateEntry();
    if (validated) {
      setEmailSent(true);
      SendEmailApi(email);
      let prevEmail = email;
      setEmailBtnEnabled(false);
      setCodeVerificationSectionVisible(true);
      let count = 30;
      var interval = setInterval(() => {
        setEmailBtnTxt(count.toString());
        if (count == 0) {
          clearInterval(interval);
          // after interval is done
          setEmailBtnEnabled(true);
          setEmailBtnTxt("Resend Email");
        }
        count -= 1;
      }, 1000);
      return;
    }
    setEmailSent(false);
  };

  const codeSubmition = async () => {
    if (code.length !== 6) {
      setCodeSectionError(true);
      setCodesectionMessage("code must be at least 6 digits long.");
      return;
    }

    setCodesectionMessage("");
    const success = await GetPasswordResetCodeApi(code, pass).then(
      (success) => {
        if (!success) {
          setCodeSectionError(true);
          setCodesectionMessage(
            "Password has not been reset, make sure you have correctly typed in the code above and retry."
          );
        } else {
          setCodeSectionError(false);
          setCodesectionMessage(
            "Password has Successfully been updated. Return to the login screen to jump back into Communovo!"
          );
        }
      }
    );
  };
  return (
    <View>
      <View className=" mt-14 ml-6 flex-row">
        <TouchableOpacity
          className=" flex "
          onPress={() => parentSetter(false)}
        >
          <View className=" flex w-5 h-7">
            <Image
              contentFit="cover"
              className=" flex-1"
              source={require("../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
        <Text className=" text-2xl ml-[14%]">Password Recovery</Text>
      </View>
      <View className=" flex w-full items-center mt-24">
        {errorMessage !== "" && (
          <Text className=" text-red-500 text-xl">{errorMessage}</Text>
        )}

        <View className=" w-[90%] flex flex-row">
          <View className=" flex w-14 h-10">
            <Image
              className=" flex-1 ml-2 mb-1"
              contentFit="cover"
              source={require("../../assets/icons/mail.svg")}
            />
          </View>
          <TextInput
            autoCapitalize={"none"}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Registered Email"
            className=" text-3xl w-[80%] flex ml-4"
          ></TextInput>
        </View>
        <View className=" w-[90%] flex h-1 mt-2 bg-md-blue" />
        <TouchableOpacity
          className={` mt-12 px-4 py-2 ${
            !emailBtnEnabled ? "bg-red-200" : "bg-md-blue"
          } rounded-xl`}
          onPress={() => {
            if (emailBtnEnabled) {
              sendRequest();
            }
          }}
        >
          <Text className=" text-2xl">{emailBtnTxt}</Text>
        </TouchableOpacity>
        {emailSent ? (
          <View className=" w-full h-24 flex items-center mt-4">
            <Text className=" text-md text-center">
              Email has been sent to provided email. If email was not recived
              make sure the email provided was correctly typed and resubmit.
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      {codeVerificationSectionVisible && (
        <View className=" flex w-full items-center">
          <View className=" w-[90%] flex flex-row">
            <View className=" flex w-16 h-10">
              <Text className=" text-2xl text-md-purple  font-bold">Code</Text>
            </View>
            <TextInput
              autoCapitalize={"none"}
              onChangeText={(text) => setCode(text)}
              value={code}
              placeholder="Verification Code"
              className=" text-3xl w-[80%] flex ml-4"
            ></TextInput>
          </View>
          <View className=" w-[90%] flex h-1 mt-2 bg-md-blue ml-5" />
          <View className=" w-[90%] flex flex-row mt-8">
            <View className=" flex w-10 h-11 ml-4">
              <Image
                className=" flex-1"
                contentFit="cover"
                source={require("../../assets/login/lock.svg")}
              />
            </View>
            <TextInput
              secureTextEntry={true}
              autoCapitalize={"none"}
              onChangeText={(text) => setPass(text)}
              value={pass}
              placeholder="New Password"
              className=" text-3xl w-[80%] flex ml-7"
            ></TextInput>
          </View>
          <View className=" w-[90%] flex h-1 mt-2 bg-md-blue ml-5" />
          <TouchableOpacity
            className={` mt-12 px-4 py-2 bg-md-blue rounded-md `}
            onPress={codeSubmition}
          >
            <Text className=" text-2xl">Submit Code</Text>
          </TouchableOpacity>
          <Text
            className={`text-lg text-${
              codeSectionError ? "red" : "green"
            }-400 text-center mt-4`}
          >
            {codeSectionMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default AccountRecovery;
