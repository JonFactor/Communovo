import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { GetUserViaIdApi } from "../../functions/Auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProfilePictureCard from "../cards/ProfilePictureCard";
import { Linker } from "../../utils/Linker";

interface IUserCollecitionParams {
  userList: any;
}

/*------------------------------------------------- USER CARD COLLECTION -
  |  CORISPONDING CARD: user
  |
  |  Purpose:  
  |          display a list of users via the user card in a .map function.
  |          
  |  Main Logic:  
  |          extract the user card details in a useState hook outside of the map()
  |           
  |  Input / Params:  
  |          userList -> list of ids
  |          
  |  Display / Output:  
  |          a list of user cards
  |          
  *-------------------------------------------------------------------*/

const UserCollection = ({ userList }: IUserCollecitionParams) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});

  return (
    <ScrollView horizontal={true} className=" h-32 w-full ">
      {userList.map != undefined &&
        userList.map((user: number, index) => {
          const name = currentUserDetails["name"];
          const id = currentUserDetails["id"];

          return (
            <TouchableOpacity
              className=" w-28 aspect-square bg-gray-200 border-2 border-black border-solid rounded-xl mt-2 ml-4"
              key={index}
              onPress={() => {
                Linker(`/profile/${id}`);
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
