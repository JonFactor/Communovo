import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { IUser } from "../../functions/Auth";
import { Storage } from "aws-amplify";
import { Linker } from "../../utils/Linker";

interface IProfileHorizontalCardParams {
  profile: IUser;
  goToProfile?: boolean;
}

/*------------------------------------------------- PROFILE HORIZONTAL CARD -
  |
  |  Purpose:  
  |          display the basic user infromation to be used in a collection but in 
  |          a horizontal manner, for user adding to events/groups and user following information
  |           
  |  Main Logic:  
  |          get the profile picture via the profile object.
  |          
  |  Input / Params:  
  |          the profile / user object and like the groupcard a goto boolean to prevent 
  |          the click action from working.
  |           
  |  Display / Output:  
  |          a left to right vertically concious view of the users basic details for 
  |          account information section.
  |           
  |               
  *-------------------------------------------------------------------*/

const ProfileHorizontalCard = ({
  profile,
  goToProfile = false,
}: IProfileHorizontalCardParams) => {
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
          if (goToProfile && profile.id !== undefined) {
            Linker(`profile/${profile.id}`);
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

export default ProfileHorizontalCard;
