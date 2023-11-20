import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { IUser } from "../../functions/Auth";
import { Storage } from "aws-amplify";
import router from "../../common/routerHook";

const ProfileHorizontal = ({ profile, goToProfile }) => {
  const [userProfilePic, setUserProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const getImg = async () => {
      const profileImg = profile.profilePic;
      const result = await Storage.get(profileImg);
      setUserProfilePic(result);
    };
    getImg();
    setIsLoading(false);
  }, []);

  return (
    <View>
      <TouchableOpacity
        className=" flex-row ml-2"
        onPress={() => {
          if (goToProfile) {
            router.replace(`profile/${profile.name}`);
          }
        }}
      >
        <View className=" flex aspect-square w-12">
          <Image
            className="flex-1 rounded-full "
            contentFit="cover"
            source={userProfilePic}
          />
        </View>
        <Text className=" ml-2 text-xl mt-2">{profile.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHorizontal;
