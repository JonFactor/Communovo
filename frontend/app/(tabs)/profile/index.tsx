import { View, Text, RefreshControl, Modal, BackHandler } from "react-native";
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
import {
  DeleteSelfUserApi,
  IUser,
  GetUserViaIdApi,
} from "../../../functions/Auth";
import { GetSelfFollowingApi, IUserToUser } from "../../../functions/Auth";
import ProfileEvents from "../../../components/Views/ProfileEvents";
import GroupCollection from "../../../components/collections/GroupCollection";
import { Redirect } from "expo-router";
import { Linker } from "../../../utils/Linker";
import AppInfoModal from "../../../components/modals/AppInfoModal";
import ExitPage from "../../../components/common/ExitPage";
import { LinearGradient } from "expo-linear-gradient";

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
  const [menuModal, setMenuModal] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [appInfoModalDisplay, setAppInfoModalDisplay] = useState(false);
  const [deleteAccountTxt, setDeleteAccountTxt] = useState("Delete Account");

  useEffect(() => {
    const loadUser = async () => {
      const content: IUser = await getUserInfo();
      // set user desc
      if (content == null) {
        return <Redirect href={"/login"}></Redirect>;
      }
      setUserDesctiption(content.description);
      setUserName(content.name);
      setUserId(content.id);

      const profilePic = await getUserProfilePhoto(false, "");
      setUserProfilePic(profilePic);

      const follows = await GetSelfFollowingApi(content.email);
      console.log(follows);
      if (follows === null) {
      } else {
        for (let i = 0; i < follows.length; i++) {
          const user = await GetUserViaIdApi(follows[i].secondUser.toString());
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
    await fetchImageFromUri(result.assets[0].uri).then((response) => {
      setUserProfilePic(response);
    });
    setUserProfilePhoto(result);
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
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

  const handleDisplayProfileActions = () => {
    setMenuModal(true);
  };

  const handleDeleteAccount = () => {
    if (deleteAccountTxt === "Delete Account") {
      setDeleteAccountTxt("Are you Sure?");
      return;
    }

    DeleteSelfUserApi();
    Linker("/login");
  };

  return (
    <ScrollView className=" mt-20">
      <Modal visible={appInfoModalDisplay}>
        <AppInfoModal parentSetter={setAppInfoModalDisplay} />
      </Modal>
      {redirectLogin && <Redirect href="/login"></Redirect>}
      {/* {menuModal && (
        <View className=" bg-transparent w-full h-16 flex-row ml-4">
          <TouchableOpacity
            className="p-1 px-3 bg-md-blue rounded-md"
            onPress={() => setAppInfoModalDisplay(true)}
          >
            <Text className=" text-xl">App Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1 px-3 bg-md-blue rounded-md ml-12"
            onPress={() => {
              logout(true);
              setRedirectLogin(true);
            }}
          >
            <Text className=" text-xl">Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1 px-3 bg-md-blue rounded-md  ml-12"
            onPress={() => setMenuModal(false)}
          >
            <Text className="text-xl">Close</Text>
          </TouchableOpacity>
        </View>
      )} */}
      {!menuModal ? (
        <View className=" flex-row ml-16 ">
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
            className=" ml-4 w-1/6"
            onPress={() => {
              handleDisplayProfileActions();
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
      ) : (
        <View className=" flex w-full items-center">
          <View className=" flex h-60 flex-row space-x-4">
            <View className=" flex space-y-3">
              <TouchableOpacity
                className="  w-36 h-32 rounded-2xl flex items-center"
                onPress={() => {
                  logout(true);
                  setRedirectLogin(true);
                }}
              >
                <LinearGradient
                  className=" w-full h-full rounded-2xl flex items-center"
                  colors={["rgba(86,218,99,1)", "rgba(189,234,194,1)"]}
                  start={[0, 1]}
                  end={[1, 0]}
                >
                  <Text className=" text-white text-2xl mt-4 ">Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                className="  w-36 h-28 rounded-2xl flex items-center"
                onPress={handleDeleteAccount}
              >
                <LinearGradient
                  className=" w-full h-full rounded-2xl flex items-center"
                  colors={["rgba(210,95,229,1)", "rgba(244,177,255,1)"]}
                  start={[1, 0]}
                  end={[0, 1]}
                >
                  <Text className=" text-white text-2xl mt-4  text-center w-10/12">
                    {deleteAccountTxt}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View className=" flex space-y-3">
              <TouchableOpacity
                className="  w-36 h-20 rounded-2xl flex items-center"
                onPress={() => {
                  setMenuModal(false);
                  setDeleteAccountTxt("Delete Account");
                }}
              >
                <LinearGradient
                  className=" w-full h-full rounded-2xl flex items-center"
                  colors={["rgba(238,51,51,1)", "rgba(246,204,204,1)"]}
                  start={[1, 0]}
                  end={[0, 1]}
                >
                  <Text className=" text-white text-2xl mt-4  text-center">
                    Close
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                className="  w-36 h-40 rounded-2xl flex items-center"
                onPress={() => {
                  setAppInfoModalDisplay(true);
                }}
              >
                <LinearGradient
                  className=" w-full h-full rounded-2xl flex items-center"
                  colors={["rgba(187,189,242,1)", "rgba(44,53,232,1)"]}
                  start={[1, 0]}
                  end={[0, 1]}
                >
                  <Text className=" text-white text-2xl mt-4  text-center">
                    App Info
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
              {following === null || following.length < 1 ? (
                <View className=" w-full items-center flex">
                  <Text className=" text-xl">Nothing to see here</Text>
                </View>
              ) : (
                <View>
                  {following.map((value, index: number) => {
                    return (
                      <TouchableOpacity
                        className=" bg-gray-200 w-full h-20 rounded-full p-2 mt-4"
                        key={index}
                        onPress={() => Linker(`/profile/${value.id}`)}
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
