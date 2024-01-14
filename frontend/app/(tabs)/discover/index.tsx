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
import { GetAllGroupsApi, IGroup } from "../../../functions/Groups";
import { Storage } from "aws-amplify";
import GroupCard from "../../../components/cards/GroupCard";
import { IEvent } from "../../../functions/Events";
import { IUser } from "../../../functions/Auth";
import { SearchAllDB } from "../../../functions/Misc";
import UserCollection from "../../../components/collections/UserCollection";
import GroupCollection from "../../../components/collections/GroupCollection";
import EventsCollection from "../../../components/collections/EventsCollection";

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
      const groups = await GetAllGroupsApi();
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
        <View className=" flex space-y-8">
          <View>
            <Text className=" text-2xl ml-4">Event Results</Text>
            <ScrollView horizontal={true} className=" ml-4">
              <EventsCollection
                filters={[]}
                noFilter={true}
                isOnlyLiked={false}
                isOnlyDisliked={false}
                excludeDisliked={false}
                baisedOnGroup={false}
                groupTitle={null}
                justSmallCards={true}
              ></EventsCollection>
            </ScrollView>
          </View>
          <View>
            <Text className=" text-2xl ml-4">Group Results</Text>
            <ScrollView horizontal={true} className=" h-44">
              <GroupCollection
                groupIds={searchResult["group"]}
                groupsViaUser={false}
                horizontal={true}
                cardWidth={36}
                cardSquare={true}
              />
            </ScrollView>
          </View>
          <View>
            <Text className=" text-2xl ml-4 mb-1">User Results</Text>
            <UserCollection userList={searchResult["user"]} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default DiscoverPage;
