import { View, Text, ScrollView } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import EventCard from "../cards/EventCard";
import { FilterContext } from "../../app/(tabs)/home";
import { GetEventArrayApi, IEvent } from "../../functions/Events";

interface IEventCollectionParams {
  filters: string[];
  noFilter: boolean;
  isOnlyLiked: boolean;
  isOnlyDisliked: boolean;
  excludeDisliked: boolean;
  baisedOnGroup: boolean;
  groupTitle: string;
  justSmallCards: boolean;
  counterSetter?: (params) => void;
}

const EventsCollection = ({
  filters,
  noFilter,
  isOnlyLiked,
  isOnlyDisliked,
  excludeDisliked,
  baisedOnGroup,
  groupTitle,
  justSmallCards,
  counterSetter = (params) => {},
}: IEventCollectionParams) => {
  // pull events from db
  const [smallCards, setSmallCards] = useState(false);

  if (filters !== undefined) {
    filters = filters["filters"];
  }
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    if (justSmallCards === undefined) {
      setSmallCards(false);
    } else {
      setSmallCards(justSmallCards);
    }

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
        content = await GetEventArrayApi(
          false,
          false,
          false,
          true,
          groupTitle
        ).then((response) => {
          return response;
        });
        console.log(content, groupTitle);
      } else {
        params = [];
      }

      content = await GetEventArrayApi(...params);
      counterSetter(content.length);
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
    <View>
      {!smallCards ? (
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
                        justSmallCards={false}
                      />
                    </View>
                  );
                }
              }
            )}
        </View>
      ) : (
        <View>
          {eventData !== undefined && eventData !== null && (
            <ScrollView horizontal={true} className=" space-x-6">
              {eventData.map(
                ({ date, eventType, location, title, id, coverImg }, index) => {
                  const day = date.split("-")[1];
                  const month = date.split("-")[2];
                  const isFiltered = handleIsFiltered(eventType);

                  if (isFiltered) {
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
                          justSmallCards={justSmallCards}
                        />
                      </View>
                    );
                  }
                }
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default EventsCollection;
