import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { GetEventArrayApi, IEvent } from "../../functions/Events";
import EventCard from "../cards/EventCard";
import EventTypeList, { IEventType } from "../../constants/EventTypeList";

const FilteredEvents = () => {
  const [currentFilter, setCurrentFilter] = useState([]);
  const [eventData, setEventData] = useState(Array<IEvent>);
  const [eventTypeListNames, setEventTypeListNames] = useState(Array<String>);

  const handleFilterBtnPress = (index: number) => {
    if (!currentFilter.includes(EventTypeList[index])) {
      setCurrentFilter((currentFilter) => [
        ...currentFilter,
        EventTypeList[index].name,
      ]);
    } else {
      setCurrentFilter(currentFilter.filter((value) => value === index));
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      const content = await GetEventArrayApi(
        false,
        false,
        true,
        false,
        ""
      ).then((response) => {
        return response;
      });

      setEventData(content);
    };
    getEvents();

    for (let i = 0; i < EventTypeList.length; i++) {
      setEventTypeListNames((value) => [...value, EventTypeList[i].name]);
    }
  }, []);

  return (
    <View>
      <ScrollView
        horizontal
        indicatorStyle="white"
        className=" flex-row mx-2 space-x-4 mt-4 absolute"
      >
        <TouchableOpacity
          className={` w-10 aspect-square rounded-full items-center ${
            currentFilter.length < 1
              ? "bg-md-purple border-2 border-solid border-md-purple"
              : "border-2 border-solid border-black"
          }`}
          onPress={() => setCurrentFilter([])}
        >
          <Text className=" text-lg p-1 font-semibold"> All </Text>
        </TouchableOpacity>
        {EventTypeList.map((value: IEventType, index: number) => {
          return (
            <TouchableOpacity
              className={` px-3 rounded-full
              items-center ${
                currentFilter.includes(EventTypeList[index].name)
                  ? "bg-md-blue border-md-blue border-solid border-2"
                  : "border-gray-500 border-solid border-2"
              }`}
              key={index}
              onPress={() => {
                handleFilterBtnPress(index);
              }}
            >
              <Text className=" mt-1 text-lg">{value.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View className=" w-full h-full mt-16">
        {eventData !== undefined &&
          eventData.length > 0 &&
          eventData.map(
            ({ date, eventType, location, title, id, coverImg }, index) => {
              const day = date.split("-")[1];
              const month = date.split("-")[2];
              let badFiltersCount = 0;
              if (currentFilter.length > 0) {
                for (let i = 0; i < currentFilter.length; i++) {
                  if (
                    eventTypeListNames[
                      eventTypeListNames.indexOf(currentFilter[i])
                    ] !== eventType
                  ) {
                    badFiltersCount += 1;
                  }
                }

                if (badFiltersCount >= currentFilter.length) {
                  return <View></View>;
                }
              }
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
    </View>
  );
};

export default FilteredEvents;
