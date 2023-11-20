import { View, Text, ActivityIndicator, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "expo-image";
import router from "../../../common/routerHook";
import { AuthContext } from "../../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  AddUserToGroupView,
  CreateGroup,
  IGroup,
} from "../../../functions/Groups";
import GroupTypeSelectionModal from "../../../components/modals/GroupTypeSelectionModal";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";

const createGroup = () => {
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [groupType, setGroupType] = useState("");
  const [groupOwner, setGroupOwner] = useState("");
  const [groupImageKey, setGroupImageKey] = useState("");

  const [showTypeModal, setShowTypeModal] = useState(false);

  const [warning, setWarning] = useState("");

  const { getUserInfo, isLoading, setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    const getGroupOwner = async () => {
      const userInfo = await getUserInfo();
      setGroupOwner(userInfo.email);
    };
    getGroupOwner();
  }, []);

  const entryValidation = (): boolean => {
    if (groupTitle.length < 1) {
      setWarning("Title is required");
      return false;
    }

    if (groupType === "") {
      setWarning("Group Type is required");
      return false;
    }

    return true;
  };

  const handleGroupSubmit = async () => {
    setIsLoading(true);
    if (!entryValidation()) {
      setIsLoading(false);
      return;
    }

    const title = groupTitle;
    const description = groupDescription;
    const image = groupImageKey;

    const groupData = await CreateGroup(
      title,
      description,
      image,
      groupType
    ).then(async () => {
      const setAsOwner = await AddUserToGroupView(
        groupOwner,
        groupTitle,
        true,
        false,
        false,
        false
      );

      if (!setAsOwner) {
        setIsLoading(false);
        return;
      }
    });
    if (groupData === null) {
      setWarning("Failed to create group, please try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.back();
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  };

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const imageUri = result.assets[0].uri;
    setGroupImage(imageUri);
    const imageKey = uuidv4();
    const imgPath = "groups/" + imageKey;

    const img = await fetchImageFromUri(imageUri);

    const imageStoreageResult = await Storage.put(imgPath, img, {
      level: "public",
      contentType: img.type,
    });

    setGroupImageKey(imgPath);
  };

  const handleAddFriends = async () => {};

  const handleSelectType = () => {
    setShowTypeModal(true);
  };

  return (
    <View>
      {isLoading ? (
        <View>
          <ActivityIndicator
            size={"large"}
            className=" mt-52"
          ></ActivityIndicator>
        </View>
      ) : (
        <View>
          <Modal visible={showTypeModal}>
            <GroupTypeSelectionModal
              parentSetter={setShowTypeModal}
              textSetter={setGroupType}
              textValue={groupType}
            ></GroupTypeSelectionModal>
          </Modal>
          <View className=" ml-8 flex-row mt-16">
            <TouchableOpacity
              className=" flex w-5 h-7   "
              onPress={() => router.back()}
            >
              <View className=" flex w-5 h-7">
                <Image
                  contentFit="cover"
                  className=" flex-1"
                  source={require("../../../assets/icons/backArrow.svg")}
                />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView className=" mt-10 h-full p-4">
            <View className=" w-full items-center space-y-6 flex">
              <View className=" w-72 rounded-2xl h-60 flex">
                <Image
                  className=" flex-1 rounded-3xl bg-gray-400"
                  contentFit="cover"
                  source={groupImage}
                >
                  <TouchableOpacity
                    onPress={handleAddPhoto}
                    className=" flex  bg-md-purple rounded-full aspect-square w-16 border-2 border-white ml-52 mt-40 "
                  >
                    <View className=" p-3 flex-1 h-12 mt-1">
                      <Image
                        className=" flex h-7  w-9"
                        contentFit="cover"
                        source={require("../../../assets/icons/camera.svg")}
                      />
                    </View>
                  </TouchableOpacity>
                </Image>
              </View>
              {warning !== "" && (
                <Text className="2xl text-red-400">{warning}</Text>
              )}
              <View className=" w-72 h-16 border-4 border-md-purple rounded-full">
                <TextInput
                  className=" text-3xl mt-3 ml-6"
                  placeholder="Title"
                  value={groupTitle}
                  onChangeText={(text) => {
                    setGroupTitle(text);
                  }}
                ></TextInput>
              </View>
              <View className=" w-72 py-2 border-4 border-md-purple rounded-xl">
                <TextInput
                  className=" text-2xl ml-6"
                  placeholder="Description"
                  multiline={true}
                  value={groupDescription}
                  onChangeText={(text) => {
                    setGroupDescription(text);
                  }}
                ></TextInput>
              </View>
              <TouchableOpacity
                className=" w-72 py-2 border-4 border-md-purple bg-blue-100 rounded-full"
                onPress={handleSelectType}
              >
                <View className=" flex items-center w-full">
                  <Text className=" text-2xl ">
                    {groupType === "" ? "Type" : groupType}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className=" w-72 py-2 border-4 border-md-purple bg-blue-100 rounded-full"
                onPress={handleAddFriends}
              >
                <View className=" flex items-center w-full">
                  <Text className=" text-2xl ">Invite Friends</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className=" w-72 bg-green-200 border-green-100 border-2 h-20 rounded-full mt-12 items-center"
                onPress={handleGroupSubmit}
              >
                <Text className=" text-3xl mt-4">🥳 Submit 🥳</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default createGroup;
