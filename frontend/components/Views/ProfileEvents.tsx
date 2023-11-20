import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import EventsCollection from "../collections/EventsCollection";

const ProfileEvents = () => {
  const [isSelectedDis, setIsSelectedDis] = useState(false);
  const [isSelectedLik, setIsSelectedLik] = useState(false);
  const handleDislikeClick = () => {
    if (isSelectedDis) {
      setIsSelectedDis(false);
      setIsSelectedLik(true);
    } else {
      setIsSelectedDis(true);
      setIsSelectedLik(false);
    }
  };

  const handleLikeClick = () => {
    if (isSelectedDis) {
      setIsSelectedDis(false);
      setIsSelectedLik(true);
    } else {
      setIsSelectedDis(true);
      setIsSelectedLik(false);
    }
  };

  // useEffect(() => {

  // }, [isSelectedDis, isSelectedLik])

  return (
    <View>
      <View className=" w-screen flex items-center space-x-4 flex-row mt-6 ml-2">
        <TouchableOpacity
          className={` w-40 h-12 ${
            !isSelectedLik ? "bg-md-blue" : "bg-white border-4 border-md-blue"
          } rounded-full flex items-center`}
          onPress={handleLikeClick}
        >
          <Text
            className={` ${
              !isSelectedLik ? "text-white mt-2" : "text-md-blue mt-1"
            } text-2xl `}
          >
            Liked
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={` w-40 h-12 ${
            !isSelectedDis
              ? "bg-md-purple"
              : "bg-white border-4 border-md-purple"
          } rounded-full flex items-center`}
          onPress={handleDislikeClick}
        >
          <Text
            className={` ${
              !isSelectedDis ? "text-white mt-2" : "text-md-purple mt-1"
            } text-2xl `}
          >
            Disliked
          </Text>
        </TouchableOpacity>
      </View>
      {isSelectedDis ? (
        <EventsCollection
          filters={[]}
          noFilter={true}
          isOnlyLiked={false}
          isOnlyDisliked={true}
        />
      ) : isSelectedLik ? (
        <EventsCollection
          filters={[]}
          noFilter={true}
          isOnlyLiked={true}
          isOnlyDisliked={false}
        />
      ) : (
        <EventsCollection
          filters={[]}
          noFilter={true}
          isOnlyLiked={false}
          isOnlyDisliked={false}
        />
      )}
    </View>
  );
};

export default ProfileEvents;
