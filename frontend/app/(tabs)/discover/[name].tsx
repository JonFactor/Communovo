import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import { Image } from "expo-image";
import {
  CreateGroupUserRelationshipApi,
  GetGroupDetailsViaTitleApi,
  GetGroupMemberArrayViaTitleApi,
  IGroup,
} from "../../../functions/Groups";
import ProfileHorizontalCard from "../../../components/cards/ProfileHorizontalCard";
import { IUser } from "../../../functions/Auth";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import EventsCollection from "../../../components/collections/EventsCollection";
import { Storage } from "aws-amplify";
import { Linker } from "../../../utils/Linker";

/*----------------------------------------- Group Details Page -------
|
|  Purpose:  
|     - Provide a view for the details of the group and actions for the user
|     in the group. Along with other details loaded on page load (weather, ...).
|
| ------------------------
|
|  Main JS Sections:
|     - useStates are for the group data and stats for the group that are
|     loaded on view time, via the useEffect hook and their apis.
|
|     - loadProfile is used to set the order of data to be loaded going: 
|     groupData, groupImg, groupMembers, and stats + other data and
|     handleUserJoin is for when the user clicks join group, creating a new
|     relationship between the user and group via the api call.
|
| ------------------------
|
|  Main Html Sections:
|     - this section is split into 2 mostly related parts split by a purple divider:
|      -- above and around contains the essentials, title pic desc stats type
|      -- below has the members, events, and member joining / leaving
|
*-------------------------------------------------------------------*/

const CatigoryDetailsPage = () => {
  const { name } = useLocalSearchParams();
  const nameString: string = name
    .toString()
    .replace("%20", " ")
    .replace("%20", " ")
    .replace("%20", " ");

  const { user } = useAuth();

  const [groupData, setGroupData] = useState<IGroup>();
  const [groupImg, setGroupImg] = useState("");
  const [groupPeople, setGroupPeople] = useState<Array<IUser>>();
  const [groupStaff, setGroupStaff] = useState<Array<IUser>>();
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const loadGroupData = async () => {
      const response = await GetGroupDetailsViaTitleApi(nameString);

      if (response != null) {
        setGroupData(response);
      }
    };

    const loadGroupMembers = async () => {
      const responseAll = await GetGroupMemberArrayViaTitleApi(
        nameString,
        false
      );

      if (responseAll != null) {
        setGroupPeople(responseAll);
        setMemberCount(responseAll.length + memberCount);
      }

      const responseStaff = await GetGroupMemberArrayViaTitleApi(
        nameString,
        true
      );
      if (responseStaff != null) {
        setGroupStaff(responseStaff);
        setMemberCount(responseStaff.length + memberCount);
      }
    };

    const loadProfile = async () => {
      if (groupData === undefined || groupData.image === undefined) {
        return;
      }
      const cover = await Storage.get(groupData.image);
      setGroupImg(cover);
    };

    loadGroupData().then(() => {
      loadGroupMembers();
      loadProfile();
    });
  }, []);

  useEffect(() => {}, [groupImg]);

  const handleUserJoin = async () => {

    const responseOk = await CreateGroupUserRelationshipApi(
      user.email,
      nameString,
      false,
      false,
      true,
      false
    );
    if (responseOk) {
      Linker("/discover");
    }
  };

  return (
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="w-1" />
      <View className=" mt-10 p-4">
        <View className=" flex flex-row w-screen ml-4">
          <View className=" ">
            <TouchableOpacity
              className=""
              onPress={() => {
                Linker("/discover");
              }}
            >
              <Text className=" text-red-400 text-xl">exit</Text>
            </TouchableOpacity>
            <Text
              className={` ${
                nameString !== undefined && nameString.length > 12
                  ? "text-2xl"
                  : "text-3xl"
              }`}
            >
              {nameString}
            </Text>
          </View>
          <View className=" absolute inset-y-0 right-12">
            <ProfilePictureCard width={16} />
          </View>
        </View>
      </View>
      <View className=" w-full flex h-64 bg-gray-300">
        <Image className=" flex-1" contentFit="cover" source={groupImg} />
      </View>
      <View>
        <Text className=" text-lg mt-2 px-4">
          {groupData === undefined
            ? "nothing to see here..."
            : groupData.description}
        </Text>
        <View className=" w-screen h-2 bg-md-purple mt-2" />
      </View>
      <View className=" flex-row mx-6 space-x-4 items-center w-screen mt-2  ">
        <View className=" flex-row">
          <Text className=" text-lg">Type: </Text>
          <Text className=" text-lg ml-2">
            {groupData === undefined
              ? "..."
              : groupData.groupType.length > 6
              ? groupData.groupType.slice(0, 6)
              : groupData.groupType}
          </Text>
        </View>
        <View className=" flex-row">
          <Text className=" text-lg">Members: </Text>
          <Text className=" text-lg ml-2">
            {memberCount === undefined ? "..." : memberCount}
          </Text>
        </View>
        <View className=" flex-row">
          <Text className=" text-lg">Events: </Text>
          <Text className=" text-lg ml-2">
            {eventCount === undefined ? "..." : eventCount}
          </Text>
        </View>
      </View>
      <View>
        <Text className=" text-4xl ml-8 mt-4">Staff</Text>
        <ScrollView horizontal className=" mt-2 px-4 space-x-6">
          {groupStaff !== undefined &&
            groupStaff.map((member: IUser, index: number) => {
              return (
                <View
                  key={index}
                  className=" rounded-full px-4 py-1 border-4 border-md-blue"
                >
                  <ProfileHorizontalCard profile={member} goToProfile={true} />
                </View>
              );
            })}
        </ScrollView>
        <Text className=" text-4xl ml-8 mt-4">Members</Text>
        <ScrollView horizontal className="  mt-2 px-4 space-x-4">
          {groupPeople !== undefined &&
            groupPeople.map((member: IUser, index: number) => {
              return (
                <View
                  key={index}
                  className=" rounded-full px-4 py-1 border-4 border-md-blue"
                >
                  <ProfileHorizontalCard profile={member} goToProfile={true} />
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View className=" mt-8">
        <TouchableOpacity
          className=" px-4 py-1 bg-green-500 items-center"
          onPress={handleUserJoin}
        >
          <Text className=" text-white text-2xl">Become A Member Today!</Text>
        </TouchableOpacity>
      </View>
      <View className=" mt-4 ml-2">
        <Text className=" text-4xl ml-8 mt-4">Events</Text>
        <EventsCollection
          baisedOnGroup={true}
          groupTitle={nameString}
          filters={[]}
          noFilter={true}
          isOnlyDisliked={false}
          excludeDisliked={false}
          isOnlyLiked={false}
          justSmallCards={false}
          counterSetter={setEventCount}
        ></EventsCollection>
      </View>
    </ScrollView>
  );
};

export default CatigoryDetailsPage;
