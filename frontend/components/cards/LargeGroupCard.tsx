import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { IGroup } from "../../functions/Groups";
import { Storage } from "aws-amplify";
import { router } from "expo-router";

const LargeGroupCard = ({ group }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getImg = async () => {
      const img = await Storage.get(group.image);
      setImage(img);
    };

    getImg();
  }, []);

  const handleGroupClick = () => {
    router.push(`discover/${group.title}`);
  };
  return (
    <View>
      <TouchableOpacity
        className=" w-11/12 h-60 bg-gray-200 rounded-3xl flex"
        onPress={handleGroupClick}
      >
        {image !== null && (
          <Image
            className="flex-1 rounded-3xl flex items-center"
            contentFit="cover"
            source={image}
          >
            <Text className=" bg-white  px-4 py-2 mt-4 text-xl">
              {group.title}
            </Text>
          </Image>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LargeGroupCard;
