import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import { AuthContext } from "../../context/AuthContext";
import { GetUserViaIdApi } from "../../functions/Auth";
import { Storage } from "aws-amplify";

import useSWR from "swr";

interface IProfilePictureCardParams {
  width: number;
  userid?: string | number;
  passedPic?: string;
  passBackSetter?: (param) => void | null;
}

const ProfilePictureCard = ({
  width,
  userid = null,
  passedPic = null,
  passBackSetter = null,
}: IProfilePictureCardParams) => {
  const { getUserProfilePhoto, isLoading } = useContext(AuthContext);
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const profilePicSelf = async () => {
      if (passedPic !== null) {
        setUserProfilePic(passedPic);
        return;
      }
      const profile = await getUserProfilePhoto(false, "1");
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
