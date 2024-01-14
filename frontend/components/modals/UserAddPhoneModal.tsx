import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Linker } from "../../utils/Linker";
import { useState } from "react";
import {
  AddPhoneNumberUserApi,
  PhoneNotifyUserApi,
} from "../../functions/Auth";

export const UserAddPhoneModal = ({
  eventId,
  parentSetter,
  eventTitle,
  eventDate,
}) => {
  const [number, setNumber] = useState("");
  const handlePhoneNumberSubmit = async () => {
    if (number === "" || number === undefined) {
      return;
    }
    const responseSuccess = await AddPhoneNumberUserApi(
      number,
      eventTitle,
      eventDate
    );
    if (responseSuccess) {
      PhoneNotifyUserApi(number, eventTitle, eventDate);
      Linker(`/events/${eventId}`);
    }
  };
  return (
    <ScrollView className=" h-screen w-full mt-14 px-6">
      <View className=" flex-row w-full">
        <TouchableOpacity
          onPress={() => {
            // parentSetter(false);
            Linker(`/events/${eventId}`);
          }}
        >
          <Text className=" text-2xl text-red-400">Exit</Text>
        </TouchableOpacity>
        <Text className=" text-2xl ml-4">Add Your Phone Number</Text>
      </View>
      <View className=" ml-2 mt-12">
        <Text className=" text-3xl">Phone Number:</Text>
        <TextInput
          value={number}
          onChangeText={(text) => {
            setNumber(text);
          }}
          placeholder="000-000-0000"
          className=" w-3/4 text-xl border-black border-2 border-solid rounded-xl py-2 px-4 mt-2"
        ></TextInput>
      </View>
      <View className=" mt-10 ml-2">
        <TouchableOpacity
          className=" bg-green-300 px-8 py-4 w-1/2 rounded-xl"
          onPress={handlePhoneNumberSubmit}
        >
          <Text className=" text-3xl text-white font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
