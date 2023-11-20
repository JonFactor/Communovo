import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Storage } from "aws-amplify";
import { LinearGradient } from "expo-linear-gradient";

const GroupCard = ({ item, routingIgnore }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const setImg = async () => {
      if (item.image.includes("https://")) {
        setImage(item.image);
        return;
      }

      const img = await Storage.get(item.image);
      setImage(img);
    };
    setImg();
  }, []);

  const handleGroupSelect = () => {
    if (routingIgnore !== "True") {
      router.push(`discover/${item.title}`);
    }
  };

  return (
    <TouchableOpacity
      className=" w-52 h-36 rounded-xl flex ml-4"
      onPress={handleGroupSelect}
    >
      <View className=" flex w-full h-full">
        <LinearGradient
          className=" flex w-full h-full rounded-t-xl"
          colors={["rgba(0,0,0,.15)", "transparent"]}
        >
          <Image
            className=" flex-1 rounded-2xl items-center"
            contentFit="cover"
            source={image}
          >
            <View className=" bg-white rounded-bl-2xl rounded-br-2xl w-full h-12 border-black mt-28 flex items-center ">
              <Text className="  text-md-purple text-xl font-semibold">
                {item.title}
              </Text>
            </View>
          </Image>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default GroupCard;
