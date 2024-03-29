import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ExitPage from "../common/ExitPage";
import { ScrollView } from "react-native-gesture-handler";
import MapView from "react-native-maps";

interface IMapModalParams {
  parentSetter: (params) => void;
  input: boolean;
  location: string;
  regionSetter: (params) => void;
  passedRegion: any;
}

/*------------------------------------------------- MAP MODAL -
  |
  |  Purpose:  
  |          display a map given cords / no cords, with the addition of input if needed
  |          to set a location cords.
  |          
  |  Main Logic:  
  |          set the map to the passedRegion
  |          when a location is selected via the input boolean being true, set name to picked.
  |          set a new region to parent setter when btn for it is clicked
  |                 
  *-------------------------------------------------------------------*/

const MapModal = ({
  parentSetter,
  input,
  location,
  regionSetter,
  passedRegion,
}: IMapModalParams) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [region, setRegion] = useState(null);
  useEffect(() => {
    if (location === "") {
      if (region === null) {
        setSelectedLocation("No location has been selected.");
      } else {
        setSelectedLocation("Location Picked!");
      }
    } else {
      setSelectedLocation(location);
    }
  }, []);

  const setNewLocation = () => {
    if (region !== null) {
      regionSetter(region);
    }
  };
  return (
    <ScrollView className=" mt-10">
      <View className=" ml-4">
        <ExitPage modalSetter={parentSetter}></ExitPage>
      </View>
      {input && (
        <View className=" w-full mt-4 flex items-center">
          <TouchableOpacity
            className=" w-full  text-center py-2 items-center flex  bg-md-blue"
            onPress={() => {
              setNewLocation();
              parentSetter(false);
            }}
          >
            <Text className=" text-3xl">Set New Location</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className=" w-full flex items-center">
        <Text className=" text-2xl">{selectedLocation}</Text>
      </View>
      <View className=" w-full h-screen flex items-center mt-4">
        <View className={` w-11/12 h-screen`}>
          <MapView
            className={`w-full h-full`}
            onRegionChange={(region) => {
              if (!input) {
                return;
              }
              setRegion(region);
            }}
            initialRegion={passedRegion !== null && JSON.parse(passedRegion)}
          ></MapView>
        </View>
      </View>
    </ScrollView>
  );
};

export default MapModal;
