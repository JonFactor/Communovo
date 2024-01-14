import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import { AuthContext } from "../../context/AuthContext";
import { GetUserViaIdApi } from "../../functions/Auth";
import { Storage, StorageClass } from "aws-amplify";

import useSWR from "swr";

const ProfilePictureCard = ({
  width,
  userid = null,
  passedPic = null,
  passBackSetter = null,
}) => {
  const { getUserProfilePhoto, isLoading } = useContext(AuthContext);
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const profilePicSelf = async () => {
      if (passedPic !== null) {
        setUserProfilePic(passedPic);
        return;
      }
      const profile = await getUserProfilePhoto();
      // const image = await Storage.get(Profile.)\

      setUserProfilePic(profile);
    };

    const profilePicOther = async () => {
      const Profile = await GetUserViaIdApi(userid);

      if (passBackSetter !== null) {
        passBackSetter(Profile);
      }
      if (Profile === null) {
        return;
      }

      const userPhotoUri = Profile.profilePic;
      if (userPhotoUri.includes("www.")) {
        setUserProfilePic(userPhotoUri);
        return;
      }

      const photo: string = await Storage.get(userPhotoUri);
      setUserProfilePic(photo);
    };
    if (userid === null) profilePicSelf();
    if (userid !== null) profilePicOther();
  }, []);
  return (
    <View className={` flex w-${width} aspect-square`}>
      {userProfilePic !== null || !isLoading ? (
        <Image
          className=" flex-1 rounded-full"
          source={userProfilePic}
          contentFit="cover"
        />
      ) : (
        <View className=" rounded-full flex-1 bg-gray-400" />
      )}
    </View>
  );
};

export default ProfilePictureCard;
