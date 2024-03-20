import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Storage } from "aws-amplify";

import { CreateUser2EventPreferenceApi } from "../../functions/Events";
import { Linker } from "../../utils/Linker";

interface IEventCardParams {
  location: string;
  month: string;
  day: string;
  title: string;
  imagePath: string;
  eventType: string;
  id: number | string;
  justSmallCards: boolean;
  showIsExpired?: boolean;
  isExpired?: boolean;
}

/*------------------------------------------------- EVENT CARD ---------
  |
  |  Purpose:  
  |          Standardize the display of basic event information to be mainly used
  |          in this cards collection element, and extract logic from said card collection
  |           
  |  Main Logic:  
  |          map the month to a string, user actions to look into and add event
  |          while also giving the option to dislike the event via apis
  |           
  |  Input / Params:  
  |          location -> name, month -> number, day -> number, title -> string, imgPath ->
  |          url, eventType -> abrivated, id -> data loading, smallCards -> bool / display,
  |          showExpired / isExpire -> set the date view to be expired and non viewable.
  |           
  |  Display / Output:  
  |          an event card with either just a title and backround or ... 
  |          the date in the top left, name top middle, type top right, location bottom left,
  |          actions bottom right, backround image in the backround, dark gradient to give white,
  |          text some backround to work with.
  |               
  *-------------------------------------------------------------------*/

const EventCard = ({
  location,
  month,
  day,
  title,
  imagePath,
  eventType,
  id,
  justSmallCards,
  showIsExpired = false,
  isExpired = false,
}: IEventCardParams) => {
  const monthsToStrings = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const [image, setImage] = useState(null);
  useEffect(() => {
    const getBackround = async () => {
      let signedUrl = await Storage.get(imagePath);
      setImage(signedUrl);
    };
    getBackround();
  }, []);

  if (eventType === null || eventType === undefined) {
    eventType = "misc";
  }

  const handleNavToEvent = async () => {
    const responseOk = await CreateUser2EventPreferenceApi(title, true, false);
    if (responseOk) {
      Linker(`/events/${id}`);
    }
  };

  const handleDislikeEvent = async () => {
    const responseOk = await CreateUser2EventPreferenceApi(title, false, true);
    if (responseOk) {
      Linker("/home");
    }
  };

  const handleOpenInMaps = () => {
    // open in google maps
  };

  const handleScrollDirectionLeft = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const dif = currentOffset - 0;

    if (dif < 0) {
      return true;
    } else {
      return false;
    }
  };

  let monthIndex;
  if (month[0] === "0") {
    monthIndex = parseInt(month)[1] - 1;
  } else {
    monthIndex = parseInt(month) - 1;
  }

  return (
    <View>
      {!justSmallCards ? (
        <ScrollView
          horizontal
          className=" h-{22rem} flex w-full "
          onScrollEndDrag={async (event) => {
            const scrollLeft = handleScrollDirectionLeft(event);

            if (scrollLeft) {
              await handleDislikeEvent();
            } else {
              await handleNavToEvent();
            }
          }}
          scrollEventThrottle={16}
        >
          <Image
            source={image}
            contentFit="cover"
            className="rounded-3xl flex-1 w-11/12 ml-1"
          >
            <LinearGradient
              className=" p-4 w-full h-96 flex-col"
              colors={["rgba(0,0,0,.15)", "transparent"]}
            >
              <View className=" flex-row">
                {!showIsExpired ? (
                  <View className=" flex-col items-center bg-red-400 w-16 aspect-square rounded-full">
                    <Text className=" text-3xl text-white mt-2  absolute">
                      {day}
                    </Text>
                    <Text className=" text-white mt-10 ">
                      {monthsToStrings[monthIndex]}
                    </Text>
                  </View>
                ) : (
                  <View className=" flex-col items-center bg-red-400 w-16 aspect-square rounded-full">
                    {!isExpired ? (
                      <>
                        <Text className=" text-3xl text-white mt-2  absolute">
                          {day}
                        </Text>
                        <Text className=" text-white mt-10 ">
                          {monthsToStrings[monthIndex]}
                        </Text>
                      </>
                    ) : (
                      <Text className=" text-white text-lg mt-4">EXPIRED</Text>
                    )}
                  </View>
                )}
                <Text className=" ml-2 text-2xl text-white font-semibold w-44">
                  {title}
                </Text>
                <View className=" w-16 aspect-square bg-black rounded-full ml-4 items-center py-4">
                  <Text
                    className={` text-white text-${
                      eventType.length < 6 ? "lg" : "2xl"
                    } font-semibold`}
                  >
                    {eventType.length < 6
                      ? eventType
                      : `${eventType[0].toUpperCase()}${eventType[1].toUpperCase()}${eventType[2].toUpperCase()}`}
                  </Text>
                </View>
              </View>
              <View className=" mt-56 flex-row">
                <TouchableOpacity
                  onLongPress={handleOpenInMaps}
                  className=" flex-row ml-2 bg-white w-44 mt-6 rounded-full px-2 h-8"
                >
                  <View className=" flex w-3 h-4 mt-2 ml-1 ">
                    <Image
                      contentFit="cover"
                      className=" flex-1"
                      source={require("../../assets/icons/Location.svg")}
                    />
                  </View>
                  <Text className="text-black ml-2 mt-2 text-md">
                    {location.length > 20 ? location.slice(0, 20) : location}
                  </Text>
                </TouchableOpacity>
                <View className=" flex-row">
                  <TouchableOpacity
                    onPress={handleDislikeEvent}
                    className=" ml-6 mt-4 w-12 aspect-square bg-red-200 rounded-full p-2 border-solid border-white border-2"
                  >
                    <Image
                      className="flex-1 rounded-full"
                      source={require("../../assets/icons/Cross.svg")}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNavToEvent}
                    className="ml-3 w-16 aspect-square bg-green-200 rounded-full p-3 border-solid border-white border-2"
                  >
                    <Image
                      source={require("../../assets/icons/Heart.svg")}
                      contentFit="cover"
                      className="flex-1"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Image>
        </ScrollView>
      ) : (
        <TouchableOpacity
          className=" bg-gray-200 rounded-lg w-40 aspect-square"
          onPress={() => {
            Linker(`/events/${id}`);
          }}
        >
          <Image
            source={image}
            contentFit="cover"
            className="rounded-lg flex-1"
          >
            <View className=" flex-col items-center bg-red-400 mt-2 ml-2 w-12 h-12 rounded-full">
              <Text className=" text-white mt-1 text-md ">
                {monthsToStrings[monthIndex]}
              </Text>
              <Text className=" text-white text-md ">{day}</Text>
            </View>
            <View className=" bg-white w-full h-10 mt-16 flex items-center">
              <Text className=" mt-3 font-semibold">{title}</Text>
            </View>
          </Image>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EventCard;
