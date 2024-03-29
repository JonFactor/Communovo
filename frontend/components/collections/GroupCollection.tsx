import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  GetGroupViaIdApi,
  GetGroupArrayViaUserApi,
  IGroup,
} from "../../functions/Groups";
import LargeGroupCard from "../cards/LargeGroupCard";
import { IUser } from "../../functions/Auth";

interface IGroupCollectionParams {
  groupsViaUser?: boolean;
  cardWidth?: number;
  cardSquare?: boolean;
  horizontal?: boolean;
  groupIds?: any | null;
}

/*------------------------------------------------- GROUP CARD COLLECTION -
  |  CORISPONDING CARD: group
  |
  |  Purpose:  
  |          display all of the group cards, or just the ones that relate to a user
  |          
  |  Main Logic:  
  |          onLoad get all the required / filtered groups if the groupIds
  |          param is not yet set, or when that happens get info from ids.
  |           
  |  Input / Params:  
  |          viaUser -> filter boolean, width / square / horizontal -> display booean / number
  |          groupIds -> filter list.
  |           
  |  Display / Output:  
  |          a list of the filtered groups cards (title, background)
  |          
  *-------------------------------------------------------------------*/

const GroupCollection = ({
  groupsViaUser = true,
  cardWidth = 96,
  cardSquare = false,
  horizontal = false,
  groupIds = [],
}: IGroupCollectionParams) => {
  const [groupUser, setGroupUser] = useState<Array<IGroup>>(null);
  useEffect(() => {
    const getGroups = async () => {
      const response = await GetGroupArrayViaUserApi();

      if (response !== null) {
        setGroupUser(response);
      }
    };

    const getGroupsViaIds = async () => {
      const groupData: Array<IGroup> = [];

      for (let i = 0; i < groupIds.length; i++) {
        const currentGroupData = await GetGroupViaIdApi(groupIds[i]);
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
