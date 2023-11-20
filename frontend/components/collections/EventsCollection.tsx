import { View, Text, ScrollView } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import EventCard from "../cards/EventCard";
import { FilterContext } from "../../app/(tabs)/home";
import { EventsGetAll, IEvent } from "../../functions/Events";

interface params {
  filters: string[];
  noFilter: boolean;
  isOnlyLiked: boolean;
  isOnlyDisliked: boolean;
  excludeDisliked: boolean;
  baisedOnGroup: boolean;
  groupTitle: string;
}

const EventsCollection = ({
  filters,
  noFilter,
  isOnlyLiked,
  isOnlyDisliked,
  excludeDisliked,
  baisedOnGroup,
  groupTitle,
}: params) => {
  // pull events from db

  if (filters !== undefined) {
    filters = filters["filters"];
  }
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const getEventData = async () => {
      let content;
      let params = [];
      if (isOnlyDisliked) {
        params = [true, false, false, false];
      } else if (isOnlyLiked) {
        params = [false, true, false, true];
      } else if (excludeDisliked) {
        params = [false, false, true, false];
      } else if (baisedOnGroup) {
        content = await EventsGetAll(
          false,
          false,
          false,
          true,
          groupTitle
        ).then((response) => {
          return response;
        });
      } else {
        params = [];
      }
      content = await EventsGetAll(...params);
      setEventData(content);
    };

    getEventData();
  }, []);

  // reload render when filters change
  //const [filtersState, setFiltersState] = useState([]);
  //setFiltersState(filters);
  const handleIsFiltered = (eventType: string) => {
    if (noFilter) {
      return true;
    }
    if (filters === undefined || filters.length < 1) {
      return true;
    }
    const nameMatch = filters.map((value, index) => {
      if (value.toUpperCase() === eventType.toUpperCase()) {
        return true;
      }
      if (filters.indexOf(value) + 1 == filters.length) {
        return false;
      }
    });

    if (nameMatch[0]) {
      return true;
    }

    return false;
  };

  return (
    <View className="flex h-5/6 w-full  ">
      {eventData !== undefined &&
        eventData !== null &&
        eventData.map(
          ({ date, eventType, location, title, id, coverImg }, index) => {
            const day = date.split("-")[1];
            const month = date.split("-")[2];
            const isFiltered = handleIsFiltered(eventType);

            if (isFiltered) {
              return (
                <View key={index} className=" mt-4 w-screen  flex">
                  <EventCard
                    title={title}
                    day={day}
                    month={month}
                    location={location}
                    id={id}
                    imagePath={coverImg}
                    eventType={eventType}
                  />
                </View>
              );
            }
          }
        )}
    </View>
  );
};

export default EventsCollection;
