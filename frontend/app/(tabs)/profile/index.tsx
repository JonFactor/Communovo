import { View, Text, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import router from "../../../common/routerHook";
import { Image } from "expo-image";
import EventsCollection from "../../../components/collections/EventsCollection";
import * as ImagePicker from "expo-image-picker";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { ScrollView } from "react-native";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import { IUser, UserViaId } from "../../../functions/Auth";
import { FindFollowing, IUserToUser } from "../../../functions/Relations";
import ProfileEvents from "../../../components/Views/ProfileEvents";
import GroupCollection from "../../../components/collections/GroupCollection";

const profile = () => {
  const { logout, getUserInfo, getUserProfilePhoto, setUserProfilePhoto } =
    useContext(AuthContext);

  const [following, setFollowing] = useState(Array<IUser>);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDesctiption] = useState("");
  const [navSelected, setNavSelected] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const content: IUser = await getUserInfo();
      // set user desc

      setUserDesctiption(content.description);
      setUserName(content.name);
      setUserId(content.id);

      const profilePic = await getUserProfilePhoto();
      setUserProfilePic(profilePic);

      const follows = await FindFollowing(content.email);
      if (follows === null) {
        console.log("following nulled");
      } else {
        for (let i = 0; i < follows.length; i++) {
          const user = await UserViaId(follows[i].secondUser.toString());
          setFollowing((list) => [...list, user]);
        }
      }
    };
    loadUser();

    const findFollowing = async () => {};
    findFollowing();
  }, []);

  const handleAddPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const userProfilePhoto = await setUserProfilePhoto(result);

    await fetchImageFromUri(result).then((result) => {
      setUserProfilePic(result);
      console.log(result);
    });
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  };

  const handleMessageUser = () => {
    // goto message page with this user as recipiant
  };

  const handleFollowUser = () => {
    // add this user to following page
  };

  const handleLoadEvents = () => {
    setNavSelected(0);
  };

  const handleGroupsSelect = () => {
    setNavSelected(1);
  };

  const handleFollowingSelect = () => {
    setNavSelected(2);
  };

  const handleDisplayProfileActions = () => {};
  return (
    <ScrollView className=" mt-20">
      <View className=" flex-row ml-8 ">
        <TouchableOpacity className=" flex  " onPress={() => router.back()}>
          <View className=" flex w-5 h-7">
            <Image
              contentFit="cover"
              className=" flex-1"
              source={require("../../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
        <View className=" w-5/6 flex items-center mt-2">
          <TouchableOpacity
            onPress={handleAddPhotos}
            className={`flex w-40 rounded-full  aspect-square ${
              userProfilePic === null && " bg-gray-400 items-center flex"
            }`}
          >
            {userProfilePic !== null && <ProfilePictureCard width={"24"} />}
          </TouchableOpacity>
          <View className=" mt-2 items-center w-full">
            <Text className=" flex text-3xl font-bold ">{userName}</Text>
            <Text className=" text-md w-5/6 font-semibold text-gray-500 text-center">
              {userDescription}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className=" ml-2 w-1/6"
          onPress={() => {
            handleDisplayProfileActions();
            logout();
          }}
        >
          <View className=" flex w-2 h-10">
            <Image
              source={require("../../../assets/icons/Menu.svg")}
              contentFit="fill"
              className=" flex-1 "
            />
          </View>
        </TouchableOpacity>
      </View>
      <View className=" flex-col mt-4 w-full items-center  flex">
        <View className=" flex-row mt-4">
          <TouchableOpacity
            className=" rounded-full border-[3px] border-light-blue py-2 px-10"
            onPress={handleMessageUser}
          >
            <Text className=" text-xl font-semibold text-light-blue">
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" rounded-full bg-light-blue py-3 px-14 ml-3"
            onPress={handleFollowUser}
          >
            <Text className=" text-xl text-white font-semibold">Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className=" flex-row space-x-12 px-12 mt-8">
          <TouchableOpacity onPress={handleLoadEvents}>
            <Text
              className={`text-lg text-black ${
                navSelected !== 0 && "text-gray-500"
              } font-semibold`}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGroupsSelect}>
            <Text
              className={`text-lg text-black ${
                navSelected !== 1 && "text-gray-500"
              } font-semibold`}
            >
              Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFollowingSelect}>
            <Text
              className={`text-lg text-black ${
                navSelected !== 2 && "text-gray-500"
              } font-semibold`}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
        <View className=" w-5/6 h-1 bg-md-purple rounded-lg ml-8 mt-1" />
        <View className=" mx-4">
          {navSelected === 0 ? (
            <ProfileEvents />
          ) : navSelected === 1 ? (
            <GroupCollection />
          ) : (
            <View className=" mt-4">
              {following === null || following.map === undefined ? (
                <View>
                  <Text>Nothing to see here</Text>
                </View>
              ) : (
                <View>
                  {following.map((value, index: number) => {
                    return (
                      <TouchableOpacity
                        className=" bg-gray-200 w-full h-20 rounded-full p-2 mt-4"
                        key={index}
                      >
                        <View className=" flex-row space-x-8 ">
                          <View className=" mt-2 ml-2">
                            <ProfilePictureCard
                              width={"12"}
                              userid={value.id}
                              passedPic={userProfilePic}
                            />
                          </View>
                          <View className=" flex-col ml-4 mt-1">
                            <Text className=" text-2xl font-semibold">
                              {value.name}
                            </Text>
                            <Text>{value.description}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default profile;
