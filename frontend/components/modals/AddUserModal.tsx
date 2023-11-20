import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import EventRegisterModalTemplate from "./EventRegisterModalTemplate";
import { IUser, UserViaId } from "../../functions/Auth";
import { AuthContext } from "../../context/AuthContext";
import { FindFollowing } from "../../functions/Relations";
import { Image } from "expo-image";
import { Storage } from "aws-amplify";

const AddUserModal = ({ setter, parentSetter, parentValue, isGuests }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [friends, setFriends] = useState(Array<IUser>);
  const [profilePics, setProfilePics] = useState([]);

  const { getUserInfo } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      const userData = await getUserInfo();
      const follows = await FindFollowing(userData.email);
      if (follows === null) {
        console.log("following nulled");
      } else {
        for (let i = 0; i < follows.length; i++) {
          const user = await UserViaId(follows[i].secondUser.toString());
          if (!friends.includes(user)) {
            setFriends((list) => [...list, user]);

            const img = await Storage.get(user.profilePic);
            setProfilePics([...profilePics, img]);
          }
        }
      }

      setSelectedItems([...parentValue]);
    };
    getFriends();
  }, []);

  const GroupSelection = (value: IUser) => {
    if (parentValue.includes(value)) {
      console.log("q");
      setSelectedItems(
        selectedItems.filter((item: string) => item !== value.email.toString())
      );
      parentSetter(
        parentValue.filter((item: IUser) => item.email === value.email)
      );
    } else {
      setSelectedItems((list) => [...list, value.email]);
      console.log(value);
      if (!parentValue.includes(value)) {
        console.log("huh");
        parentSetter((list) => [...list, value]);
      }
    }
  };
  return (
    <EventRegisterModalTemplate setter={setter}>
      <ScrollView className=" px-4">
        <View className=" w-full flex items-center">
          <Text className=" text-4xl">{isGuests ? "Guests" : "Co-Owner"}</Text>
          <View className=" mt-4 w-full flex items-center">
            {friends.map((user: IUser, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => GroupSelection(user)}
                  className={` w-72 bg-md-${
                    !parentValue.includes(user) ? "purple" : "blue"
                  }  h-24 mt-4 rounded-full flex items-center justify-center`}
                >
                  <View className=" flex-row space-x-6">
                    <View className=" flex w-16 aspect-square">
                      <Image
                        className=" rounded-full flex-1"
                        contentFit="cover"
                        source={profilePics[index]}
                      />
                    </View>
                    <Text className=" text-3xl mt-4">{user.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </EventRegisterModalTemplate>
  );
};

export default AddUserModal;
