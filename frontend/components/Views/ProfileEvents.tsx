import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import EventsCollection from "../collections/EventsCollection";
import { GetEventArrayApi, IEvent } from "../../functions/Events";
import EventCard from "../cards/EventCard";

const ProfileEvents = ({ showLikedDisliked = true }) => {
  const [isSelectedDis, setIsSelectedDis] = useState(false);
  const [isSelectedLik, setIsSelectedLik] = useState(false);
  const [eventData, setEventData] = useState(Array<IEvent> || undefined);

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

  useEffect(() => {
    const getEvents = async () => {
      const content = await GetEventArrayApi(
        isSelectedDis,
        isSelectedLik,
        false,
        false,
        ""
      ).then((response) => {
        return response;
      });

      setEventData(content);
    };
    getEvents();
  }, [isSelectedDis, isSelectedLik]);
  // useEffect(() => {

  // }, [isSelectedDis, isSelectedLik])

  return (
    <View>
      <View className=" w-screen flex items-center space-x-4 flex-row mt-6 ml-2">
        {showLikedDisliked && (
          <>
            <TouchableOpacity
              className={` w-40 h-12 ${
                !isSelectedLik
                  ? "bg-md-blue"
                  : "bg-white border-4 border-md-blue"
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
          </>
        )}
      </View>
      {eventData !== undefined &&
        eventData.length > 0 &&
        eventData.map(
          ({ date, eventType, location, title, id, coverImg }, index) => {
            const day = date.split("-")[1];
            const month = date.split("-")[2];
            return (
              <View key={index} className=" mt-4  flex">
                <EventCard
                  title={title}
                  day={day}
                  month={month}
                  location={location}
                  id={id}
                  imagePath={coverImg}
                  eventType={eventType}
                  justSmallCards={false}
                />
              </View>
            );
          }
        )}
    </View>
  );
};

export default ProfileEvents;
