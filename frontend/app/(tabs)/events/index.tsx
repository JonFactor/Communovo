import { View, Text, TextInput, ActivityIndicator, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import register from "../register";
import * as ImagePicker from "expo-image-picker";
import { CreateEventApi, CreateUser2EventApi } from "../../../functions/Events";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { LinearGradient } from "expo-linear-gradient";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import { AuthContext } from "../../../context/AuthContext";
import { IUser } from "../../../functions/Auth";
import GroupSelectionModal from "../../../components/modals/GroupSelectionModal";
import EventTypeModal from "../../../components/modals/EventTypeModal";
import AddUserModal from "../../../components/modals/AddUserModal";
import { IGroup } from "../../../functions/Groups";
import ProfileHorizontal from "../../../components/cards/ProfileHorizontal";
import { Linker } from "../../../utils/Linker";
import { InputMapInfo } from "../../../utils/Maps";
import ExitPage from "../../../components/common/ExitPage";

const eventStateDefaults = [[], ["", ""]];

const events = () => {
  const { getUserInfo } = useContext(AuthContext);

  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImgs, setEventImgs] = useState(null);
  const [eventGroupId, setEventGroupId] = useState(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState([]);
  const [eventCoHosts, setEventCoHosts] = useState(Array<IUser>);
  const [eventGuests, setEventGuests] = useState(Array<IUser>);
  const [eventDate, setEventDate] = useState("");
  const [eventRegion, setEventRegion] = useState(null);
  const [eventTime, setEventTime] = useState("");
  const [timePm, setTimePm] = useState(false);

  const [addUserModal, setAddUserModal] = useState(false);
  const [selectGroupModal, setSelectGroupModal] = useState(false);
  const [selectEventTypeModal, setSelectEventTypeModal] = useState(false);

  const [userRelation, setUserRelation] = useState("");

  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState("");

  const [hostName, setHostName] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const user: IUser = await getUserInfo();

      if (user === null) {
        return;
      }
      setHostName(user.name);
    };
    getUserData();
  }, []);

  const validateEventEntries = () => {
    let dateList = eventDate.split("/");
    if (eventTitle === "") {
      setWarning("Title is required");
      return false;
    } else if (eventRegion === null) {
      setWarning("Please set a location");
      return false;
    } else if (eventDescription === "") {
      setWarning("Description is required");
      return false;
    } else if (eventImgs === null) {
      setWarning("Background required");
      return false;
    } else if (eventGroupId === null) {
      setEventGroupId(null);
    } else if (eventLocation === null) {
      setWarning("Location is required");
      return false;
    } else if (eventDate === null) {
      setWarning("a set date is required");
      return false;
    } else if (!(eventDate.includes("/", 2) && eventDate.includes("/", 5))) {
      setWarning("date must be formated as: mm/dd/yyyy");
      return false;
    } else if (
      !(eventTime.includes(":") && eventTime.length > 2) &&
      !isNaN(parseFloat(eventTime[0])) &&
      !isNaN(parseFloat(eventTime[1]))
    ) {
      setWarning("time must be formated as: hh:mm");
      return false;
    } else if (
      parseInt(eventTime.split(":")[0]) > 12 ||
      parseInt(eventTime.split(":")[1]) > 60
    ) {
      setWarning("Time must be a real time.");
    } else if (
      parseInt(dateList[0]) > 12 ||
      parseInt(dateList[1]) > 31 ||
      parseInt(dateList[2]) > 2024
    ) {
      setWarning("date must be real. (mm < 13, dd < 32, yyyy < 2024)");
      return false;
    } else if (eventType === null) {
      setWarning("Please set a cover image.");
      return false;
    }
    return true;
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  };

  const handleEventSubmit = async () => {
    setIsLoading(true);
    if (!validateEventEntries()) {
      setIsLoading(false);
      return;
    }
    const imageKey = uuidv4();
    const img = await fetchImageFromUri(eventImgs);
    const imgPath = "events/" + imageKey;

    const imageStoreageResult = await Storage.put(imgPath, img, {
      level: "public",
      contentType: img.type,
    });

    let dateList = eventDate.split("/");
    const date = `${dateList[2]}-${dateList[0]}-${dateList[1]}`;
    const catigory = eventType.length > 0 ? eventType.join(", ") : "misc";
    const group = eventGroupId !== null ? eventGroupId.toString() : "1";
    const cords = JSON.stringify(eventRegion);

    const splittedtime = eventTime.split(":");
    if (timePm) {
      parseInt(splittedtime[0]) + 12;
    }
    const formatedTime = splittedtime.join(":");
    console.log(formatedTime);
    const responseOk = await CreateEventApi(
      eventTitle,
      eventDescription,
      date,
      catigory,
      eventLocation,
      imgPath,
      group,
      cords,
      formatedTime
    );
    if (!responseOk) {
      setIsLoading(false);
      Linker("/home");
      return;
    }

    const ownerEventOk = await CreateUser2EventApi(
      false,
      "",
      eventTitle,
      true,
      false,
      false
    );
    if (!ownerEventOk) {
      setIsLoading(false);
      return;
    }

    for (let i = 0; i < eventCoHosts.length; i++) {
      const resultOk = CreateUser2EventApi(
        true,
        eventCoHosts[i].email,
        eventTitle,
        false,
        true,
        false
      );
      if (!resultOk) {
        setIsLoading(false);
        return;
      }
    }
    for (let i = 0; i < eventGuests.length; i++) {
      const resultOk = CreateUser2EventApi(
        true,
        eventGuests[i].email,
        eventTitle,
        false,
        false,
        true
      );
      // if (!resultOk) {
      //   setIsLoading(false);
      //   return;
      // }
    }

    setEventTitle("");
    setEventDescription("");
    setEventImgs(null);
    setEventGroupId(null);
    setEventLocation("");
    setEventType([]);
    setEventCoHosts([]);
    setEventGuests([]);
    setEventDate("");
    setEventRegion(null);
    setEventTime("");
    setIsLoading(false);

    setIsLoading(false);
    Linker("/home");
  };

  const handleEventBack = () => {
    Linker("/home");
  };

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }
    setEventImgs(result.assets[0].uri);
  };

  const handleAddNewCoHost = () => {
    setUserRelation("COHOST");
    setAddUserModal(true);
  };

  const handleAddNewGuest = () => {
    setUserRelation("GUEST");
    setAddUserModal(true);
  };

  const handleEventTypeAdd = () => {
    setSelectEventTypeModal(true);
  };

  const handleGroupSelect = () => {
    setSelectGroupModal(true);
  };

  const handleETypeItemClick = (value: string) => {
    setEventGroupId(null);
  };

  useEffect(() => {
    if (
      (eventDate.length === 2 || eventDate.length === 5) &&
      eventDate[eventDate.length - 1] != "/"
    ) {
      setEventDate(eventDate + "/");
    }
  }, [eventDate]);

  return (
    <View className=" bg-gray-200 h-full">
      {isLoading ? (
        <View>
          <ActivityIndicator size={"large"} className=" mt-72  " />
        </View>
      ) : (
        <ScrollView className=" mt-14">
          <Modal visible={addUserModal}>
            {userRelation === "COHOST" ? (
              <AddUserModal
                setter={setAddUserModal}
                parentSetter={setEventCoHosts}
                parentValue={eventCoHosts}
                isGuests={false}
              ></AddUserModal>
            ) : (
              <AddUserModal
                setter={setAddUserModal}
                parentSetter={setEventGuests}
                parentValue={eventGuests}
                isGuests={true}
              ></AddUserModal>
            )}
          </Modal>
          <Modal visible={selectEventTypeModal}>
            <EventTypeModal
              setter={setSelectEventTypeModal}
              parentSetter={setEventType}
              parentValue={eventType}
            ></EventTypeModal>
          </Modal>
          <Modal visible={selectGroupModal} className=" mt-8 p-2">
            <GroupSelectionModal
              setter={setSelectGroupModal}
              parentSetter={setEventGroupId}
              parentValue={eventGroupId}
            ></GroupSelectionModal>
          </Modal>
          <View className=" h-72 flex w-full">
            <LinearGradient
              className=" w-full h-full flex"
              colors={["rgba(0,0,0,.25)", "transparent"]}
            >
              <Image className=" flex-1" contentFit="cover" source={eventImgs}>
                <TouchableOpacity
                  onPress={handleAddPhoto}
                  className=" flex  bg-md-purple rounded-full aspect-square w-20 border-4 border-white ml-72 mt-44"
                >
                  <View className=" p-4 flex-1 h-12 mt-1">
                    <Image
                      className=" flex h-8 w-10"
                      contentFit="cover"
                      source={require("../../../assets/icons/camera.svg")}
                    />
                  </View>
                </TouchableOpacity>
              </Image>
            </LinearGradient>
            <View className=" w-full h-1 bg-md-purple" />
          </View>
          {}
          <View className=" flex ww-full">
            <View className=" mt-4">
              <View className=" w-full items-center flex">
                <Text className=" text-2xl text-red-400 flex">{warning}</Text>
              </View>
              <TextInput
                autoCapitalize="none"
                className=" text-3xl ml-4"
                placeholder="Event Title"
                value={eventTitle}
                onChangeText={(text) => {
                  setEventTitle(text);
                }}
              ></TextInput>
              <View className=" w-4/4 bg-gray-300 h-2 mt-4 " />
            </View>
            <View className=" mt-4">
              <TextInput
                autoCapitalize="none"
                className=" text-2xl ml-4 "
                placeholder="Description"
                multiline={true}
                value={eventDescription}
                onChangeText={(text) => {
                  setEventDescription(text);
                }}
              ></TextInput>
              <View className=" w-4/4 bg-gray-300 h-2 mt-4" />
            </View>
            <View className=" mt-2">
              <TextInput
                autoCapitalize="none"
                className=" text-2xl ml-4 "
                placeholder="Date"
                multiline={true}
                value={eventDate}
                onChangeText={(text) => {
                  setEventDate(text);
                }}
              ></TextInput>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2 flex-row">
              <TextInput
                autoCapitalize="none"
                className=" text-2xl ml-4 w-1/2 "
                placeholder="Time (hh:mm)"
                multiline={true}
                value={eventTime}
                onChangeText={(text) => {
                  setEventTime(text);
                }}
              ></TextInput>
              <TouchableOpacity
                className={` w-16 h-10 bg-${
                  timePm ? "md-blue" : "green-400"
                } ml-2 rounded-xl flex items-center`}
                onPress={() => {
                  setTimePm(false);
                }}
              >
                <Text className=" text-lg mt-1">AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTimePm(true);
                }}
                className={` w-16 h-10 bg-${
                  !timePm ? "md-blue" : "green-400"
                } ml-4 rounded-xl flex items-center`}
              >
                <Text className=" text-lg mt-1">PM</Text>
              </TouchableOpacity>
            </View>
            <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            <View className=" mt-2">
              <TextInput
                autoCapitalize="none"
                className=" text-2xl ml-4 "
                placeholder="Location Name"
                multiline={true}
                value={eventLocation}
                onChangeText={(text) => {
                  setEventLocation(text);
                }}
              ></TextInput>
              <View className=" mt-4 flex-row ">
                <View className=" mt-1 ml-4">
                  <InputMapInfo regionSetter={setEventRegion}></InputMapInfo>
                </View>
                {eventRegion !== "null" &&
                  eventRegion !== null &&
                  eventRegion !== "" && (
                    <View className="bg-green-400 w-10 mt-1 h-10 rounded-full ml-4" />
                  )}
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2">
              <View className="ml-4  flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 mr-4">Host</Text>
                <ProfilePictureCard width={"12"} />
                <Text className=" text-2xl mt-2 ml-2">{hostName}</Text>
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2">
              <View className=" flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 mr-4 ml-4">
                  Co-Hosts
                </Text>
                <ScrollView horizontal>
                  {eventCoHosts.map((value: IUser, index: number) => {
                    return (
                      <View key={index}>
                        <ProfileHorizontal
                          profile={value}
                          goToProfile={false}
                        ></ProfileHorizontal>
                      </View>
                    );
                  })}
                  <TouchableOpacity
                    className=" w-12 aspect-square ml-4 bg-md-blue rounded-full"
                    onPress={handleAddNewCoHost}
                  >
                    <View className=" flex w-8 mt-2 ml-2 rounded-full aspect-square">
                      <Image
                        className=" flex-1 rounded-full rotate-45"
                        contentFit="cover"
                        source={require("../../../assets/icons/white-cross.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2">
              <View className=" flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 mr-12 ml-4">
                  Guests
                </Text>
                <ScrollView horizontal>
                  {eventGuests.map((value: IUser, index: number) => {
                    return (
                      <View key={index}>
                        <ProfileHorizontal
                          profile={value}
                          goToProfile={false}
                        ></ProfileHorizontal>
                      </View>
                    );
                  })}
                  <TouchableOpacity
                    className=" w-12 aspect-square ml-4 bg-md-blue rounded-full"
                    onPress={handleAddNewGuest}
                  >
                    <View className=" flex w-8 mt-2 ml-2 rounded-full aspect-square">
                      <Image
                        className=" flex-1 rounded-full rotate-45"
                        contentFit="cover"
                        source={require("../../../assets/icons/white-cross.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2 flex">
              <View className=" flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 ml-4">Group</Text>
                <ScrollView horizontal className=" ml-4">
                  <View className=" flex-row mt-1">
                    {eventGroupId !== null && (
                      <TouchableOpacity className=" px-2 rounded-full h-10 border-2 border-md-blue ml-2">
                        <Text className=" text-lg p-1">{eventGroupId}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    className=" w-12 aspect-square ml-4 bg-md-blue rounded-full"
                    onPress={handleGroupSelect}
                  >
                    <View className=" flex w-8 mt-2 ml-2 rounded-full aspect-square">
                      <Image
                        className=" flex-1 rounded-full rotate-45"
                        contentFit="cover"
                        source={require("../../../assets/icons/white-cross.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
            <View className=" mt-2 flex">
              <View className=" flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 mr-8 ml-4">
                  Type
                </Text>
                <ScrollView horizontal className="">
                  {eventType !== null && (
                    <View className=" flex-row mt-1">
                      {eventType.map((value: string, index: number) => {
                        return (
                          <TouchableOpacity
                            className=" px-2 rounded-full h-10 border-2 border-md-purple ml-2"
                            key={index}
                          >
                            <Text className=" text-lg p-1">{value}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                  <TouchableOpacity
                    className=" w-12 aspect-square ml-4 bg-md-blue rounded-full"
                    onPress={handleEventTypeAdd}
                  >
                    <View className=" flex w-8 mt-2 ml-2 rounded-full aspect-square">
                      <Image
                        className=" flex-1 rounded-full rotate-45"
                        contentFit="cover"
                        source={require("../../../assets/icons/white-cross.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View className=" w-4/4 bg-gray-300 h-2 mt-2" />
            </View>
          </View>
          {}
          <View className=" flex-row mt-4 mx-10 w-screen ">
            <View className=" mt-2">
              <ExitPage redirectLink="/home" largeText={true} />
            </View>

            <TouchableOpacity
              className=" rounded-xl bg-green-300 w-52 h-14 ml-20 flex items-center"
              onPress={handleEventSubmit}
            >
              <Text className=" text-white text-3xl mt-2">Submit</Text>
            </TouchableOpacity>
          </View>
          <View className=" h-20 w-2" />
        </ScrollView>
      )}
    </View>
  );
};

export default events;
