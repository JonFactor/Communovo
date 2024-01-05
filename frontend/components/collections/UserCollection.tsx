import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { IUser, UserViaId } from "../../functions/Auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { Storage } from "aws-amplify";
import ProfilePictureCard from "../cards/ProfilePictureCard";
import router from "../../common/routerHook";

const UserCollection = ({ userList }) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const GetUserDetails = async (id: number) => {
    const userDetails = await UserViaId(id.toString());
    setCurrentUserDetails(userDetails);
  };

  return (
    <ScrollView horizontal={true} className=" h-32 w-full ">
      {userList.map != undefined &&
        userList.map((user: number, index) => {
          // GetUserDetails(user);
          const name = currentUserDetails["name"];

          // const userPhotoUri = currentUserDetails["profilePic"];

          // if (userPhotoUri.includes("www.")) {
          //   const photo = userPhotoUri;
          //   return;
          // }

          // const getUserPicture = async () => {
          //   const photo: string = await Storage.get(userPhotoUri);
          // };
          return (
            <TouchableOpacity
              className=" w-28 aspect-square bg-gray-200 border-2 border-black border-solid rounded-xl mt-2 ml-4"
              key={index}
              onPress={() => {
                router.replace(`/profile/${name}`);
              }}
            >
              <View className=" flex-1 w-full h-full items-center mt-2">
                <ProfilePictureCard
                  width={14}
                  userid={user}
                  passBackSetter={setCurrentUserDetails}
                ></ProfilePictureCard>
                <Text className=" text-md mt-1 font-semibold w-[90%] text-center">
                  {name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
};

export default UserCollection;
