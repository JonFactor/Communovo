import { View, Text, TextInput, ActivityIndicator, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import register from "../register";
import * as ImagePicker from "expo-image-picker";
import { EventCreate, User2Event } from "../../../functions/Events";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import router from "../../../common/routerHook";
import { LinearGradient } from "expo-linear-gradient";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import { AuthContext } from "../../../context/AuthContext";
import { IUser } from "../../../functions/Auth";
import GroupSelectionModal from "../../../components/modals/GroupSelectionModal";
import EventTypeModal from "../../../components/modals/EventTypeModal";
import AddUserModal from "../../../components/modals/AddUserModal";
import { IGroup } from "../../../functions/Groups";
import ProfileHorizontal from "../../../components/cards/ProfileHorizontal";

const events = () => {
  const { getUserInfo } = useContext(AuthContext);
  // absolutelty disscusting state declarations
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDesctiption] = useState("");
  const [eventImgs, setEventImgs] = useState(null);
  const [eventGroupId, setEventGroupId] = useState(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState([]);
  const [eventCoHosts, setEventCoHosts] = useState(Array<IUser>);
  const [eventGuests, setEventGuests] = useState(Array<IUser>);
  const [eventDate, setEventDate] = useState("");

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
    } else if (eventDescription === "") {
      setWarning("Description is required");
      return false;
    } else if (eventImgs === null) {
      // setWarning("Background required");
      // return false;
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
      parseInt(dateList[0]) > 12 ||
      parseInt(dateList[1]) > 31 ||
      parseInt(dateList[2]) > 2024
    ) {
      setWarning("date must be real. (mm < 13, dd < 32, yyyy < 2024)");
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
    const catigory = eventType.join(", ");
    const group = eventGroupId.toString();
    const responseOk = await EventCreate(
      eventTitle,
      eventDescription,
      date,
      catigory,
      eventLocation,
      imgPath,
      group
    );

    if (!responseOk) {
      console.log(1);
      setIsLoading(false);
      return;
    }

    const ownerEventOk = await User2Event(
      false,
      "",
      eventTitle,
      true,
      false,
      false
    );
    if (!ownerEventOk) {
      console.log(2);
      setIsLoading(false);
      return;
    }

    for (let i = 0; i < eventCoHosts.length; i++) {
      const resultOk = User2Event(
        true,
        eventCoHosts[i].email,
        eventTitle,
        false,
        true,
        false
      );
      if (!resultOk) {
        console.log(3);
        setIsLoading(false);
        return;
      }
    }
    for (let i = 0; i < eventGuests.length; i++) {
      const resultOk = User2Event(
        true,
        eventGuests[i].email,
        eventTitle,
        false,
        false,
        true
      );
      if (!resultOk) {
        console.log(4);
        setIsLoading(false);
        return;
      }
    }

    router.back();
    setIsLoading(false);
  };

  const handleEventBack = () => {
    router.back();
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
                  className=" flex  bg-md-purple rounded-full aspect-square w-20 border-4 border-white ml-80 mt-44"
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
          </View>
          {}
          <View className=" flex">
            <View className=" mt-4">
              <View className=" w-full items-center flex">
                <Text className=" text-2xl text-red-400 flex">{warning}</Text>
              </View>
              <TextInput
                className=" text-3xl ml-4"
                placeholder="Event Title"
                value={eventTitle}
                onChangeText={(text) => {
                  setEventTitle(text);
                }}
              ></TextInput>
              <View className=" w-3/4 bg-light-purple h-2 mt-4 " />
            </View>
            <View className=" mt-4">
              <TextInput
                className=" text-2xl ml-4 "
                placeholder="Description"
                multiline={true}
                value={eventDescription}
                onChangeText={(text) => {
                  setEventDesctiption(text);
                }}
              ></TextInput>
              <View className=" w-3/4 bg-light-purple h-2 mt-4" />
            </View>
            <View className=" mt-2">
              <TextInput
                className=" text-2xl ml-4 "
                placeholder="Date"
                multiline={true}
                value={eventDate}
                onChangeText={(text) => {
                  setEventDate(text);
                }}
              ></TextInput>
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
            </View>
            <View className=" mt-2">
              <TextInput
                className=" text-2xl ml-4 "
                placeholder="Location"
                multiline={true}
                value={eventLocation}
                onChangeText={(text) => {
                  setEventLocation(text);
                }}
              ></TextInput>
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
            </View>
            <View className=" mt-2">
              <View className="ml-4  flex-row">
                <Text className=" text-2xl text-gray-400 mt-2 mr-4">Host</Text>
                <ProfilePictureCard width={"12"} />
                <Text className=" text-2xl mt-2 ml-2">{hostName}</Text>
              </View>
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
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
                        <ProfileHorizontal profile={value}></ProfileHorizontal>
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
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
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
                        <ProfileHorizontal profile={value}></ProfileHorizontal>
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
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
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
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
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
              <View className=" w-3/4 bg-light-purple h-2 mt-2" />
            </View>
          </View>
          {}
          <View className=" flex-row mt-4 mx-10 ">
            <TouchableOpacity
              className=" rounded-full bg-red-300 w-20 aspect-square"
              onPress={handleEventBack}
            >
              <View className=" w-10 aspect-square flex ml-5 mt-4">
                <Image
                  className=" flex-1"
                  source={require("../../../assets/icons/white-cross.svg")}
                  contentFit="fill"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className=" rounded-full bg-green-300 w-20 aspect-square ml-44"
              onPress={handleEventSubmit}
            >
              <View className=" w-10 aspect-square flex ml-5 mt-4">
                <Image
                  className=" flex-1"
                  source={require("../../../assets/icons/white-check.svg")}
                  contentFit="fill"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View className=" h-20 w-2" />
        </ScrollView>
      )}
    </View>
  );
};

export default events;
