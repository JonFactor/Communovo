import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  GetGroupViaId,
  GetGroupsViaUser,
  IGroup,
} from "../../functions/Groups";
import { IUser } from "../../functions/Auth";
import { Image } from "expo-image";
import { Storage } from "aws-amplify";
import LargeGroupCard from "../cards/LargeGroupCard";

const GroupCollection = ({
  groupsViaUser = true,
  groupIds = [null],
  cardWidth = 96,
  cardSquare = false,
  horizontal = false,
}) => {
  const [groupUser, setGroupUser] = useState<Array<IGroup>>(null);
  useEffect(() => {
    const getGroups = async () => {
      const response = await GetGroupsViaUser();

      if (response !== null) {
        setGroupUser(response);
      }
    };

    const getGroupsViaIds = async () => {
      const groupData: Array<IGroup> = [];

      for (let i = 0; i < groupIds.length; i++) {
        const currentGroupData = await GetGroupViaId(groupIds[i]);
        if (currentGroupData !== null) groupData.push(currentGroupData);
      }

      setGroupUser(groupData);
    };

    if (groupsViaUser) getGroups();
    if (groupIds !== null) getGroupsViaIds();
  }, []);

  return (
    <View>
      {groupUser === null ? (
        <View className="w-full flex items-center">
          <ActivityIndicator
            className=" mt-12"
            size={"large"}
          ></ActivityIndicator>
        </View>
      ) : (
        <View className=" mt-6 ml-4 space-y-6 ">
          {groupUser.map((value: IGroup, index: number) => {
            return (
              <View key={index} className="">
                <LargeGroupCard
                  group={value}
                  cardWidth={cardWidth}
                  cardSquare={cardSquare}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default GroupCollection;
