import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Stack, useGlobalSearchParams, useSearchParams } from "expo-router";
import { Linker } from "../../../utils/Linker";
import { Image } from "expo-image";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import useSWR from "swr";
import ProfileEvents from "../../../components/Views/ProfileEvents";
import GroupCollection from "../../../components/collections/GroupCollection";

const OtherProfile = () => {
  const { profName } = useGlobalSearchParams();
  const [navSelected, setNavSelected] = useState(0);
  const [following, setFollowing] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  return (
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }} />

      <View className=" flex-row ml-8 ">
        <TouchableOpacity className=" flex  " onPress={() => Linker("/home")}>
          <View className=" flex w-5 h-7">
            <Image
              contentFit="cover"
              className=" flex-1"
              source={require("../../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
        <View className=" w-5/6 flex items-center mt-2">
          <View className="flex w-40 rounded-full  aspect-square items-center">
            {userProfilePic !== null && <ProfilePictureCard width={"24"} />}
          </View>
          <View className=" mt-2 items-center w-full">
            <Text className=" flex text-3xl font-bold ">{"username"}</Text>
            <Text className=" text-md w-5/6 font-semibold text-gray-500 text-center">
              {"description"}
            </Text>
          </View>
        </View>
        {
          // messageing and following is not yet finished, set to true when feature functional
        }
        {true && (
          <View className=" flex-col mt-4 w-full items-center  flex">
            <View className=" flex-row mt-4">
              <TouchableOpacity
                className=" rounded-full border-[3px] border-light-blue py-2 px-10"
                // onPress={handleMessageUser}
              >
                <Text className=" text-xl font-semibold text-light-blue">
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" rounded-full bg-light-blue py-3 px-14 ml-3"
                // onPress={handleFollowUser}
              >
                <Text className=" text-xl text-white font-semibold">
                  Follow
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View>
          <View className=" flex-row space-x-12 px-12 mt-8">
            <TouchableOpacity
              onPress={() => {
                setNavSelected(0);
              }}
            >
              <Text
                className={`text-lg text-black ${
                  navSelected !== 0 && "text-gray-500"
                } font-semibold`}
              >
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setNavSelected(1);
              }}
            >
              <Text
                className={`text-lg text-black ${
                  navSelected !== 1 && "text-gray-500"
                } font-semibold`}
              >
                Groups
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setNavSelected(2);
              }}
            >
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
                {following === null || following.map === undefined ? (
                  <View>
                    <Text>Nothing to see here</Text>
                  </View>
                ) : (
                  <View>
                    {following.map((value, index: number) => {
                      return (
                        <TouchableOpacity
                          className=" bg-gray-200 w-full h-20 rounded-full p-2 mt-4"
                          key={index}
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
      </View>
    </ScrollView>
  );
};

export default OtherProfile;
