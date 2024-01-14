import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../../../context/AuthContext";
import groupTypes from "../../../constants/GroupTypes";

import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import EventOrGroupCreationModal from "../../../components/modals/EventOrGroupCreationModal";
import { Linker } from "../../../utils/Linker";
import FilteredEvents from "../../../components/Views/FilteredEvents";

export const FilterContext = createContext(null);

const home = () => {
  const randomInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const PostMessages = [
    "Spread the Word! 🤐",
    "Share your next Event! 😶‍🌫️",
    "Let the people know! 📢",
    "Just Click it 🤓",
    "You wont regret it! 🤔",
  ];

  const randomizedPostMessage = PostMessages[randomInRange(0, 4)];

  const [displayCreationModal, setDisplayCreationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentFilter, setCurrentFilter] = useState([]);
  const [gotoLogin, setGotoLogin] = useState(false);

  const { getUserInfo, setStopLoading } = useContext(AuthContext);

  useEffect(() => {
    const setUser = async () => {
      const userD = await getUserInfo(); // .then((response) => {
      setUserData(userD);
      if (userD === null) {
        setGotoLogin(true);
      }
      setStopLoading(true);
    };

    setUser();
  }, []);

  useEffect(() => {
    if (gotoLogin) {
      Linker("/login");
    }
  }, [gotoLogin]);

  const handleFilterBtnPress = (index: number) => {
    console.log(index);
    if (!currentFilter.includes(groupTypes[index])) {
      setCurrentFilter((currentFilter) => [
        ...currentFilter,
        groupTypes[index],
      ]);
    } else {
      let i = groupTypes.indexOf(groupTypes[index]);
      setCurrentFilter(currentFilter.filter((value) => value === i));
    }
  };

  return (
    <View className="w-screen flex">
      <Modal visible={displayCreationModal}>
        <EventOrGroupCreationModal
          parentSetter={setDisplayCreationModal}
        ></EventOrGroupCreationModal>
      </Modal>
      <ScrollView
        className=" mt-12 mx-4 flex"
        showsVerticalScrollIndicator={false}
      >
        <View className=" flex-row mx-4 ">
          <View className="mt-6">
            <Text className=" text-xl">
              Hi{" "}
              {userData !== undefined && userData !== null
                ? userData.name
                : "loading..."}
              ,
            </Text>
            <View className=" flex-row space-x-2">
              <Text className="text-3xl font-bold text-md-purple">Welcome</Text>
              <Text className="text-3xl font-semibold">Back</Text>
            </View>
          </View>
          <View className="flex w-20 aspect-square ml-[14%] mt-2 ">
            <ProfilePictureCard width={20} />
          </View>
        </View>
        <View className=" mt-4 ml-4 flex-row">
          <TouchableOpacity
            className=" w-14 aspect-square rounded-full bg-md-purple flex"
            onPress={() => {
              setDisplayCreationModal(true);
            }}
          >
            <Text className=" text-4xl font-semibold px-4 mt-2">+</Text>
          </TouchableOpacity>
          <Text className=" text-2xl mt-2 ml-4">{randomizedPostMessage}</Text>
        </View>
        <FilteredEvents />
      </ScrollView>
    </View>
  );
};

export default home;
