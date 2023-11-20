import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import GroupTypes from "../../../constants/GroupTypes";
import { TextInput } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { GetAllGroups, IGroup } from "../../../functions/Groups";
import { Storage } from "aws-amplify";
import GroupCard from "../../../components/cards/GroupCard";

const DiscoverPage = () => {
  const [groupData, setGroupData] = useState(Array<IGroup>);

  useEffect(() => {
    const getGroupData = async () => {
      const groups = await GetAllGroups();
      if (groups === null) {
        return;
      }

      setGroupData(groups);
    };
    getGroupData();
  }, []);

  const getBackroundImg = async (group: IGroup): Promise<string> => {
    return await Storage.get(group.image);
  };

  return (
    <ScrollView className=" flex space-y-8 mt-16">
      <View className=" w-full items-center flex ">
        <View className=" flex w-80 h-16 rounded-full border-4 border-md-blue flex-row ">
          <TextInput
            className=" p-4 text-2xl w-64"
            placeholder="Search"
          ></TextInput>
          <View className=" w-9 h-10 flex mt-2 ">
            <Image
              className=" flex-1"
              source={require("../../../assets/icons/Search.svg")}
              contentFit="cover"
            />
          </View>
        </View>
      </View>
      {GroupTypes.map((item: string, index) => {
        return (
          <View className=" mt-4" key={index}>
            <Text className=" ml-12 text-2xl text-gray-500 ">{item}</Text>
            <View>
              <ScrollView className=" h-40 p-2 flex space-x-6" horizontal>
                {groupData.map((subItem: IGroup, index: number) => {
                  if (item === subItem.groupType) {
                    return (
                      <GroupCard
                        key={index}
                        item={subItem}
                        routingIgnore={false}
                      ></GroupCard>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default DiscoverPage;
