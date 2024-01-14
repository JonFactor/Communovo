import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ExitPage from "../common/ExitPage";
import { ScrollView } from "react-native-gesture-handler";
import { PrivacyPolicy } from "../../constants/PrivacyPolicy";

interface IAppInfoModal {
  parentSetter: (param) => void;
}

const AppInfoModal = ({ parentSetter }: IAppInfoModal) => {
  const [showPrivacy, setshowPrivacy] = useState(false);
  return (
    <ScrollView className=" mt-12 px-6">
      <ExitPage redirectLink={""} modalSetter={parentSetter} />
      <View className=" w-full flex items-center mt-2">
        <Text className=" text-4xl">App Info</Text>
      </View>
      <View>
        <Text className=" text-3xl ">Mission</Text>
        <Text className=" text-md mt-4">
          Communovo is designed with the sole mission of making the world a
          better place through providing a medium for people to make
          connections. These connections are not meant to just stay on our
          platform but grow and go into the real world through our users events,
          to expand our reach even further.
        </Text>
      </View>
      <View>
        <Text className=" text-3xl ">Dev</Text>
        <Text className=" text-md mt-4">
          This app is soley developed by Jon Factor for entry into a number of
          compitions and for resume purposes. If you need to contact him / me,
          please email Jon@f4ctor.net.
        </Text>
      </View>
      <View>
        <Text className=" text-3xl ">Support</Text>
        <Text className=" text-md mt-4">
          To reach Support or Contacting for any reason please email the
          following: communovoapp@gmail.com. These emails may be recorded for
          quality ensurance purposes so please be respectful.
        </Text>
      </View>
      <View>
        <Text className=" text-3xl ">Security</Text>
        <Text className=" text-md mt-4">
          We secure your user data through state of the art encryption and
          database management systems. Your Password is also doublly encrypted
          and only in its non-encryted form when you type it in leaving no room
          for vulnerablities. We also have a strict data collection and data
          selling policy that restrcits us from using your data for any reason
          other than for the quality of this application.
        </Text>
      </View>
      <View>
        <Text className=" text-3xl ">Privacy Policy</Text>
        <TouchableOpacity
          className=" bg-md-purple w-64 flex text-center items-center rounded-xl mt-4 py-2"
          onPress={() => {
            if (showPrivacy) {
              setshowPrivacy(false);
            } else {
              setshowPrivacy(true);
            }
          }}
        >
          <Text className=" text-2xl">
            {showPrivacy ? "Hide " : "Show "} Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
      {showPrivacy && (
        <View>
          <Text className=" mt-4">{PrivacyPolicy}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AppInfoModal;
