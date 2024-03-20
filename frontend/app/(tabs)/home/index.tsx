import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../../../context/AuthContext";
import groupTypes from "../../../constants/GroupTypes";

import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import EventOrGroupCreationModal from "../../../components/modals/EventOrGroupCreationModal";
import { Linker } from "../../../utils/Linker";
import FilteredEvents from "../../../components/Views/FilteredEvents";

/*------------------------------------------------ Home Page -------
|
|  Purpose:  
|     - Provide a landing page for logged in users along with redirecting users that
|     have somehow gone to the home page that are not logged in to the login screen.
|     
|     - Let the users scroll through an event feed that they can "join" on the click of
|     a green button or a simple left swipe, "join"ing means that they create a relationship
|     with the event and goto a details page. While being able to dislike the same event.
|
|     - Give the users the oprotunity to create a new event or group that routes to the 
|     createGroup or event index page.
|
|  Main JS Sections:
|     - 3 main sections make up the JS... 
|      -- 1) This is the randomized message to incouarge the user to create a event / group.
|      creating a new text for every viewing of this page.
|
|      -- 2) The user data is mainly used to personalize the users homescreen with their
|      name and profile picture, this
|
|      -- 3) The last and most important section redirects a non-loggedin user to the login 
|      screen, making sure no malicious users get into the app without logging in.
|
|  Main Html Sections:
|     - these 3 sections are made up of a lot more than just this page's JS section.
|      -- MODAL    -> the one model in this page is used to direct the user to the event / 
|                    group creation page so they can choose which they would like to create. 
|
|     -- USER_DATA -> This section is just the data fetched in the js section displayed
|                    to create a more personalized experience for the user, leading way
|                    to potentionally an even more personalized experince with the projects
|                    plans. 
|
|      -- CONTENT  -> The content of event feed is a heavily parameterized element that 
|                    displays all of the events that have not been disliked by the user
|                    these events can be filtered by their type with a horozontally scrolling
|                    dynamically displayed event type list of buttons, updating in real time.
|
*-------------------------------------------------------------------*/

const home = () => {
  const randomInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const PostMessages = [
    "Spread the Word! 🥳",
    "Share your next Event! 😶‍🌫️",
    "Let the people know! 📢",
    "Just Click it 🤓",
    "You wont regret it! 🤔",
  ];

  const randomizedPostMessage = PostMessages[randomInRange(0, 4)];

  const [displayCreationModal, setDisplayCreationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [gotoLogin, setGotoLogin] = useState(false);

  const { getUserInfo, setStopLoading } = useContext(AuthContext);

  const setUser = async () => {
    const userD = await getUserInfo(); // .then((response) => {
    setUserData(userD);
    if (userD === null) {
      setGotoLogin(true);
    }
    setStopLoading(true);
  };

  useEffect(() => {
    setUser();
  }, []);

  useEffect(() => {
    if (userData === null) {
      setUser();
    }
  }, [userData]);

  useEffect(() => {
    if (gotoLogin) {
      Linker("/login");
    }
  }, [gotoLogin]);

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
