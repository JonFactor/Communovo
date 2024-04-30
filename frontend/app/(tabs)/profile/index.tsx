import { View, Text, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import {
  DeleteSelfUserApi,
  IUser,
  GetUserViaIdApi,
  getUserProfilePhoto,
} from "../../../functions/Auth";
import { GetSelfFollowingApi } from "../../../functions/Auth";
import ProfileEvents from "../../../components/Views/ProfileEvents";
import GroupCollection from "../../../components/collections/GroupCollection";
import { Redirect } from "expo-router";
import { Linker } from "../../../utils/Linker";
import AppInfoModal from "../../../components/modals/AppInfoModal";
import { LinearGradient } from "expo-linear-gradient";
import { fetchImageFromUri } from "../../../common/fetchImageFromUri";

/*------------------------------------------------ Self Profile Page -
|
|  Purpose:  
|     - Let the user set their own profile picture.
| 
|     - Give the user actions to delete their account, view app info, or logout via
|     the three dotted menu button, in a unquie and self designed screen.
| 
|     - View the diffrent groups and events they have or are going to join, and the users
|     they asociate with. Along with seeing what other users will see when they view their own profile.
|
|  Main JS Sections:
|     - LOAD_USER       -> this loads all of the user data into a varible and dispurses
|                         the data to the different useState hooks to update this data,
|                         along with the uses profile picture element, all in a useEffect hook.
|                         
|     - PROFILE_PIC_SET -> fetch the uri of the image that has been set to the profile picture
|                         element, and store it in a aws s3 bucket along with storing its
|                         key / id into the table in the db for this user.
|                         
|     - MODALS (KINDA)  -> The user actions stated previously can be viewed via a useState varible being set
|                         along with three different views of the users relationships... 
|                         events, groups, and following.
|                         
|     - DELETE_ACCOUNT  -> this function will check if the user has confirmed that they would
|                         like to remove their account and then do so and redirect them if clicked
|                         once more.
|
|  Main Html Sections:
|     - USER_DATA      : all set via the users cookie (yum)...
|      -- the users profile picture is on display at centerfold (in the center)
|      -- then the userName and discription of the users account follow in descending importance
|
|     - REALTION_VIEWS : a 3 pronged attack at tackeling all of the users other data...
|      -- Events are split into their liked and disliked events with their created events getting presidence
|      -- Groups are the groups that the user is apart of or has started.
|      -- Following is a list of users that the user follows or that the user has a following of
|      encapsulating their circle of people.
|
|     - USER_ACTIONS   : after you press the menu icon on the top left of the screen...
|      -- Logout   -> ressets the users auth cookies and redirects them to login
|      -- App info -> redirects the user to the app info screen with the privacy policy
|      -- Delete account -> after confirmation this will remove their account from the db
|                           and redirect them to the login screen.
|
*-------------------------------------------------------------------*/

const profile = () => {
  const { session, user } = useAuth();

  const [following, setFollowing] = useState(Array<IUser>);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDesctiption] = useState("");
  const [navSelected, setNavSelected] = useState(0);
  const [userId, setUserId] = useState(null);
  const [menuModal, setMenuModal] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [appInfoModalDisplay, setAppInfoModalDisplay] = useState(false);
  const [deleteAccountTxt, setDeleteAccountTxt] = useState("Delete Account");

  const loadUser = async () => {

    setUserDesctiption(user.description);
    setUserName(user.name);
    setUserId(user.id);

    const profilePic = await getUserProfilePhoto(false, "");
    setUserProfilePic(profilePic);

    const follows = await GetSelfFollowingApi(user.email);

    if (follows === null) {
    } else {
      for (let i = 0; i < follows.length; i++) {
        const user = await GetUserViaIdApi(follows[i].secondUser.toString());
        setFollowing((list) => [...list, user]);
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  let oldVal;

  useEffect(() => {
    if (userProfilePic === null) {
      loadUser();
      console.log("2");
    }
    if (oldVal === userProfilePic) {
      loadUser();
      console.log("3");
    }
    console.log("1");
  }, [userProfilePic]);

  const handleAddPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    const response = await fetchImageFromUri(result.assets[0].uri);
    setUserProfilePic(response);
    setUserProfilePic(result);
    oldVal = response;
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

  useEffect(() => {}, [userProfilePic]);

  return (
    <ScrollView className=" mt-20">
      <Modal visible={appInfoModalDisplay}>
        <AppInfoModal parentSetter={setAppInfoModalDisplay} />
      </Modal>
      {!menuModal ? (
        <View className=" flex-row ml-16 ">
          <View className=" w-5/6 flex items-center mt-2">
            <TouchableOpacity
              onPress={handleAddPhotos}
              className={`flex w-40 rounded-full  aspect-square ${
                userProfilePic === null && " bg-gray-400 items-center flex"
              }`}
            >
              {userProfilePic !== null && (
                <ProfilePictureCard
                  width={24}
                  passedPic={userProfilePic}
                  passBackSetter={setUserProfilePic}
                />
              )}
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
                  session.end()
                  setRedirectLogin(true);
                  Linker("/login");
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
                              width={12}
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
