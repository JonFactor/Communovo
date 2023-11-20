import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import router from "../../../common/routerHook";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import { Image } from "expo-image";
import {
  AddUserToGroupView,
  GetGroupDetails,
  GetGroupMembers,
  IGroup,
} from "../../../functions/Groups";
import GroupCard from "../../../components/cards/GroupCard";
import ProfileHorizontal from "../../../components/cards/ProfileHorizontal";
import { IUser } from "../../../functions/Auth";
import { AuthContext } from "../../../context/AuthContext";
import EventsCollection from "../../../components/collections/EventsCollection";
import { Storage } from "aws-amplify";

const CatigoryDetailsPage = () => {
  const { name } = useLocalSearchParams();
  const nameTyped: string = name.toString();

  const { getUserInfo } = useContext(AuthContext);

  const [groupData, setGroupData] = useState<IGroup>();
  const [groupImg, setGroupImg] = useState("");
  const [groupPeople, setGroupPeople] = useState<Array<IUser>>();
  const [groupStaff, setGroupStaff] = useState<Array<IUser>>();
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const loadGroupData = async () => {
      const response = await GetGroupDetails(nameTyped);

      if (response != null) {
        setGroupData(response);
      }
    };

    const loadGroupMembers = async () => {
      const responseAll = await GetGroupMembers(nameTyped, false);

      if (responseAll != null) {
        setGroupPeople(responseAll);
        setMemberCount(responseAll.length + memberCount);
      }

      const responseStaff = await GetGroupMembers(nameTyped, true);
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

  const handleUserJoin = async () => {
    const user = await getUserInfo();

    const responseOk = await AddUserToGroupView(
      user.email,
      nameTyped,
      false,
      false,
      true,
      false
    );
    if (responseOk) {
      console.log("user added");
      router.back();
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
                router.back();
              }}
            >
              <Text className=" text-red-400 text-xl">exit</Text>
            </TouchableOpacity>
            <Text
              className={` ${
                name !== undefined && name.length > 12 ? "text-2xl" : "text-3xl"
              }`}
            >
              {name}
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
            {groupData === undefined ? "..." : groupData.groupType}
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
                  <ProfileHorizontal profile={member} goToProfile={true} />
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
                  <ProfileHorizontal profile={member} goToProfile={true} />
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
      <View className=" mt-4">
        <Text className=" text-4xl ml-8 mt-4">Events</Text>
        <EventsCollection
          baisedOnGroup={true}
          groupTitle={name.toString()}
        ></EventsCollection>
      </View>
    </ScrollView>
  );
};

export default CatigoryDetailsPage;
