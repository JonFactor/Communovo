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
import { IEvent } from "../../../functions/Events";
import { IUser } from "../../../functions/Auth";
import { SearchAllDB } from "../../../functions/Misc";
import UserCollection from "../../../components/collections/UserCollection";

const DiscoverPage = () => {
  const [groupData, setGroupData] = useState(Array<IGroup>);
  const [searchActivated, setSearchActivated] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState({
    event: Array<IEvent>,
    group: Array<IGroup>,
    user: Array<IUser>,
  });
  const [searchResultsThere, setSearchResultsThere] = useState({
    events: false,
    groups: false,
    users: false,
  });

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

  const searchResultsLoad = async (text: string) => {
    const searchRes = await SearchAllDB(text);
    setSearchResult(searchRes);
    console.log(searchRes);
    if (searchRes["user"] !== "None") {
      setSearchResultsThere({ events: false, groups: false, users: true });
    }
  };

  return (
    <ScrollView className=" flex space-y-8 mt-16">
      <View className=" w-full items-center flex ">
        <View className=" flex w-80 h-16 rounded-full border-4 border-md-blue flex-row ">
          <TextInput
            className=" p-4 text-2xl w-64"
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              if (text === "") {
                setSearchActivated(false);
              } else {
                setSearchActivated(true);
                searchResultsLoad(text);
              }
            }}
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
      {!searchActivated ? (
        GroupTypes.map((item: string, index) => {
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
        })
      ) : (
        <View>
          <ScrollView horizontal={true}>
            {searchResult["event"] !== undefined &&
              searchResult["event"].length > 0 && <Text>Test</Text>}
          </ScrollView>
          <ScrollView horizontal={true}>
            {searchResult["group"] !== undefined &&
              searchResult["group"].length > 0 && <Text>Test</Text>}
          </ScrollView>
          <UserCollection />
        </View>
      )}
    </ScrollView>
  );
};

export default DiscoverPage;
