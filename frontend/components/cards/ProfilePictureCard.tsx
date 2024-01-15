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

/*------------------------------------------------- PROFILE PICTURE CARD -
  |
  |  Purpose:  
  |          display the users own profile picture or a specified users profile picture.
  |          
  |  Main Logic:  
  |          get the profile from the user information,
  |          set the profile via a passBackSetter and this cards own img setter and the useContext hooks functions
  |           
  |  Input / Params:  
  |          styling width attr, useId to be set for ther user information, passedPic for
  |          extracting the picture logic, and passBackSetter to pass back the set picture.
  |           
  |  Display / Output:  
  |          a photo that the user either sets or can just view (other peoples)
  |          
  *-------------------------------------------------------------------*/

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
