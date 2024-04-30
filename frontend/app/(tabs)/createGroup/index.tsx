import { View, Text, ActivityIndicator, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "expo-image";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  CreateGroupUserRelationshipApi,
  CreateGroupApi,
} from "../../../functions/Groups";
import GroupTypeSelectionModal from "../../../components/modals/GroupTypeSelectionModal";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { Linker } from "../../../utils/Linker";
import ExitPage from "../../../components/common/ExitPage";
import { fetchImageFromUri } from "../../../common/fetchImageFromUri";

/*------------------------------------------------ Create Group Page -
|
|  Purpose:  Provide an simple yet interactive UI (display) for the user the
|    create a new group via selected parameters, as streamlined as possible.
|
| ------------------------
|
|  Main JS Sections:
|     - All of the useState Hooks (35-46): is used due to the multiple diffrent types of 
|    objects they are capturing and putting them all in one hook would make any change 
|    reset the whole page of data.
|
|    - handle Group submit uses the validate entry function to make sure that no error occurs
|    when trying to create a new group via the group API function. 
|
| ------------------------
|
|  Main Html Sections:
|    - image picker is used to collection images from the phone to use as a cover image.
|    this will set a tone / fell for the group and let the users get a better impression
|    of what the group is about.
|
|    - touchable opacities are used to display diffrent secreens for users to enter their groups
|    data, along with submiting the form. 
|  
*-------------------------------------------------------------------*/

const createGroup = () => {
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [groupType, setGroupType] = useState("");
  const [groupOwner, setGroupOwner] = useState("");
  const [groupImageKey, setGroupImageKey] = useState("");

  const [showTypeModal, setShowTypeModal] = useState(false);

  const [warning, setWarning] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const getGroupOwner = async () => {
      const userInfo = user;
      setGroupOwner(userInfo.email);
    };
    getGroupOwner();
  }, []);

  const entryValidation = (): boolean => {
    if (groupTitle.length < 1) {
      setWarning("Title is required");
      return false;
    }

    if (groupTitle.length > 17) {
      setWarning("Title is above the length of 17 chars, please shorten it");
      return false;
    }

    if (groupType === "") {
      setWarning("Group Type is required");
      return false;
    }

    return true;
  };

  const handleGroupSubmit = async () => {
    if (!entryValidation()) {
      return;
    }

    const title = groupTitle;
    const description = groupDescription;
    const image = groupImageKey;

    const groupData = await CreateGroupApi(
      title,
      description,
      image,
      groupType
    ).then(async () => {
      const setAsOwner = await CreateGroupUserRelationshipApi(
        groupOwner,
        groupTitle,
        true,
        false,
        false,
        false
      );

      if (!setAsOwner) {
        return;
      }
    });
    if (groupData === null) {
      setWarning("Failed to create group, please try again.");
      return;
    }

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

  const handleSelectType = () => {
    setShowTypeModal(true);
  };

  return (
    <View>
      {false ? (
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
          <ScrollView className=" mt-10 h-full p-4">
            <View className=" ml-4 mb-4">
              <ExitPage redirectLink="/home" largeText={false} />
            </View>
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
