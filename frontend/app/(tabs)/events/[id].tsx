import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Touchable,
  TouchableHighlight,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useSearchParams,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import router from "../../../common/routerHook";
import {
  EventsGetDetails,
  GetEventMembers,
  IEvent,
  User2Event,
} from "../../../functions/Events";
import { Image } from "expo-image";
import { Storage } from "aws-amplify";
import { GetGroupViaId, IGroup } from "../../../functions/Groups";
import {
  IUser,
  UserGetDetails,
  UserPhoneNumberNotify,
} from "../../../functions/Auth";
import ProfileHorizontal from "../../../components/cards/ProfileHorizontal";
import { Linker } from "../../../utils/Linker";
import { GetWeatherData } from "../../../utils/Weather";
import { UserAddPhoneModal } from "../../../components/modals/UserAddPhoneModal";
import { Notification } from "../../../utils/PushNotifications";
import { Calendar } from "../../../utils/Calendar";
import { OutputMapInfo } from "../../../utils/Maps";

const eventDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const readId: string = id.toString();
  const [eventData, setEventData] = useState<IEvent>(null);
  const [eventImage, setEventImage] = useState(null);
  const [groupDetails, setGroupDetails] = useState<IGroup>(null);
  const [eventMembers, setEventMembers] = useState<Array<IUser>>(null);
  const [eventStaff, setEventStaff] = useState<Array<IUser>>(null);
  const [eventWeather, setEventWeather] = useState(null);
  const [userAddPhoneModal, setUserAddPhoneModal] = useState(false);

  useEffect(() => {
    const eventDetails = async () => {
      const content: IEvent = await EventsGetDetails(readId);
      if (content === undefined) {
        return;
      }
      setEventData(content);

      const image = await Storage.get(content.coverImg);
      setEventImage(image);

      const groupName = await GetGroupViaId(content.eventGroup);
      setGroupDetails(groupName);

      const responseAll = await GetEventMembers(readId, false);
      if (responseAll != null) {
        setEventMembers(responseAll);
      }

      const responseStaff = await GetEventMembers(readId, true);
      if (responseStaff != null) {
        setEventStaff(responseStaff);
      }

      const responseWeather = await GetWeatherData(content.location);
      if (responseWeather !== null) {
        setEventWeather(responseWeather.message);
      }
    };

    eventDetails();
  }, []);

  const handleEventJoinClick = async () => {
    const joinEvent = await User2Event(
      false,
      "",
      eventData.title,
      false,
      false,
      true
    );

    if (joinEvent) {
      Linker("/home");
    }
  };

  const handleAddReminder = async () => {
    const userDetails: IUser = await UserGetDetails();
    if (
      userDetails.phoneNum !== undefined &&
      userDetails.phoneNum !== null &&
      userDetails.phoneNum !== ""
    ) {
      // UserPhoneNumberNotify(
      //   userDetails.phoneNum,
      //   eventData.title,
      //   eventData.date
      // );
      // send message...
    } else {
      // ask user to sign up...
      setUserAddPhoneModal(true);
    }

    // add reminder to calender
    Calendar();
    // const { expoPushToken } = Notification();
  };

  return (
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }} />
      {eventData === null || groupDetails === null || eventImage === null ? (
        <View>
          <ActivityIndicator
            className=" mt-52"
            size={"large"}
          ></ActivityIndicator>
        </View>
      ) : (
        <View className="py-12 relative">
          <Modal
            visible={userAddPhoneModal}
            className=" w-full h-screen bg-black"
          >
            <UserAddPhoneModal
              eventId={readId}
              parentSetter={setUserAddPhoneModal}
              eventTitle={eventData.title}
              eventDate={eventData.date}
            ></UserAddPhoneModal>
          </Modal>
          <View className=" flex-row w-full">
            <TouchableOpacity
              className=" ml-8 mt-1 w-12 h-6  relative"
              onPress={() => {
                Linker("/home");
              }}
            >
              <Text className=" text-red-400 text-2xl">exit</Text>
            </TouchableOpacity>
            <View className=" w-3 h-1 " />
            <Text className=" text-3xl font-semibold mt-2">
              {eventData.title}
            </Text>
          </View>
          <View className=" w-screen items-center flex mt-6">
            <View className="flex  w-11/12 h-64 bg-gray-300 rounded-2xl">
              {eventImage !== null && (
                <Image
                  source={eventImage}
                  contentFit="cover"
                  className=" flex-1 rounded-2xl"
                ></Image>
              )}
            </View>
          </View>
          <View>
            <Text className=" text-lg ml-4 mt-1 font-semibold">
              {eventData.description}
            </Text>
            <View className=" w-full h-2 bg-md-purple mt-2" />
          </View>
          <View className=" px-4 mt-3 space-y-2">
            <View className=" flex-row">
              <Text className="text-2xl">Group: </Text>
              <Text className=" ml-1 text-2xl">{groupDetails.title}</Text>
            </View>
            <View className=" flex-row">
              <Text className="text-2xl">Attendence: </Text>
              <Text className=" ml-1 text-2xl">{}</Text>
            </View>
            <View className=" flex-row">
              <Text className="text-2xl">Type: </Text>
              <Text className=" ml-1 text-2xl">{eventData.eventType}</Text>
            </View>
            <View className=" flex-row">
              <Text className="text-2xl">Locaiton: </Text>
              <Text className=" ml-1 text-2xl">{eventData.location}</Text>
              <OutputMapInfo></OutputMapInfo>
            </View>
            <View className=" flex-row">
              <Text className="text-2xl">Date: </Text>
              <Text className=" ml-1 text-2xl">{eventData.date}</Text>
            </View>
          </View>
          <View className=" mt-4">
            <Text className=" ml-8 text-3xl font-semibold">Staff</Text>
            <ScrollView horizontal className="px-4 py-2 space-x-8">
              {eventStaff !== null &&
                eventStaff.map((value: IUser, index: number) => {
                  return (
                    <View
                      key={index}
                      className=" px-8 py-2 border-4 border-md-purple rounded-full"
                    >
                      <ProfileHorizontal
                        profile={value}
                        goToProfile={true}
                      ></ProfileHorizontal>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
          <View className=" mt-4">
            <Text className=" ml-8 text-3xl font-semibold">Members</Text>
            <ScrollView horizontal className="px-4 py-2 space-x-8">
              {eventMembers !== null &&
                eventMembers.map((value: IUser, index: number) => {
                  return (
                    <View
                      key={index}
                      className=" px-8 py-2 border-4 border-md-purple rounded-full"
                    >
                      <ProfileHorizontal
                        profile={value}
                        goToProfile={true}
                      ></ProfileHorizontal>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
          <View>
            <Text className=" ml-6 mt-4 text-2xl">
              Current Weather Conditions
            </Text>
            <Text className=" text-xl mt-4 ml-4">{eventWeather}</Text>
          </View>
          <TouchableOpacity
            className=" bg-green-500 w-screen mt-8 h-12 flex items-center"
            onPress={handleEventJoinClick}
          >
            <Text className=" text-3xl text-white mt-1 font-semibold">
              Book event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-yellow-500 w-screen mt-2 h-12 flex items-center"
            onPress={handleAddReminder}
          >
            <Text className=" text-3xl text-white mt-1 font-semibold">
              Add Reminder
            </Text>
          </TouchableOpacity>
          <View className=" h-12 w-1"></View>
        </View>
      )}
    </ScrollView>
  );
};

export default eventDetailsPage;
