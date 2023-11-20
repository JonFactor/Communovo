import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import router from "../../common/routerHook";
import { Image } from "expo-image";
import GroupTypes from "../../constants/GroupTypes";

const GroupTypeSelectionModal = ({ parentSetter, textSetter, textValue }) => {
  const valuesBeforeOpening = textValue;
  const [indexOfSelected, setIndexOfSelected] = useState(null);
  const handleTypeClick = (name: string, index: number) => {
    setIndexOfSelected(index);
    textSetter(name);
  };

  const handleSubmitClick = () => {
    parentSetter(false);
  };

  const handleBackClick = () => {
    textSetter(valuesBeforeOpening);
    parentSetter(false);
  };

  useEffect(() => {
    for (let i = 0; i < GroupTypes.length; i++) {
      if (textValue === GroupTypes[i]) {
        setIndexOfSelected(i);
      }
    }
  }, []);

  return (
    <ScrollView>
      <View className=" ml-8 flex-row mt-16">
        <TouchableOpacity
          className=" flex w-5 h-7   "
          onPress={handleBackClick}
        >
          <View className=" flex w-5 h-7">
            <Image
              contentFit="cover"
              className=" flex-1"
              source={require("../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View className=" flex-row flex w-5/6 ml-6 space-x-4">
        <View className="  flex w-1/2 items-center">
          {GroupTypes.map((name: string, index: number) => {
            if (index % 2 === 0) {
              return (
                <TouchableOpacity
                  className={` w-40 h-24 mt-6 flex items-center justify-center bg-md-${
                    index === indexOfSelected ? "blue" : "purple"
                  } rounded-xl`}
                  key={index}
                  onPress={() => {
                    handleTypeClick(name, index);
                  }}
                >
                  <Text className=" text-2xl text-white">{name}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
        <View className="  flex w-1/2 items-center">
          {GroupTypes.map((name: string, index: number) => {
            const realIndex = GroupTypes.indexOf(name);
            if (index % 2 !== 0) {
              return (
                <TouchableOpacity
                  className={` w-40 h-24 mt-6 flex items-center justify-center bg-md-${
                    index === indexOfSelected ? "blue" : "purple"
                  } rounded-xl`}
                  key={index}
                  onPress={() => {
                    handleTypeClick(name, realIndex);
                  }}
                >
                  <Text className=" text-2xl text-white text-center">
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
      <TouchableOpacity
        className=" bg-green-200 w-5/6 ml-6 h-28 mt-4 rounded-2xl items-center justify-center flex"
        onPress={handleSubmitClick}
      >
        <Text className=" text-4xl text-white font-semibold">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// create a list of groups, when one is clicked go back to main page and set it to the name of selected

export default GroupTypeSelectionModal;
