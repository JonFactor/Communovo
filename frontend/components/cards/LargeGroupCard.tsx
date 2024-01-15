import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { IGroup } from "../../functions/Groups";
import { Storage } from "aws-amplify";
import { Linker } from "../../utils/Linker";

interface ILargeGroupCardParams {
  group: IGroup;
  cardWidth?: number;
  cardSquare?: boolean;
}

/*------------------------------------------------- LARGE GROUP CARD ---
  |
  |  Purpose:  
  |          In the profile page the group section is larger than in any other place
  |          giving the need for a group card but larger.
  |           
  |  Main Logic:  
  |          load image and group title (standard)
  |        
  |  Input / Params:  
  |          group object and styling params
  |
  |  Display / Output:  
  |          larger version of group card.
  |   
  *-------------------------------------------------------------------*/

const LargeGroupCard = ({
  group,
  cardWidth = 96,
  cardSquare = false,
}: ILargeGroupCardParams) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getImg = async () => {
      const img = await Storage.get(group.image);
      setImage(img);
    };

    getImg();
  }, []);

  const handleGroupClick = () => {
    Linker(`discover/${group.title}`);
  };

  return (
    <View>
      {cardSquare ? (
        <TouchableOpacity
          className={`w-${cardWidth} aspect-square bg-gray-200 rounded-lg flex`}
          onPress={handleGroupClick}
        >
          {image !== null && (
            <Image
              className="flex-1 rounded-lg flex items-center"
              contentFit="cover"
              source={image}
            >
              <Text className=" bg-white w-full py-1 mt-26 text-xl text-center font-semibold">
                {group.title}
              </Text>
            </Image>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className={`${cardWidth != 96 ? "w-11/12" : "w-" + cardWidth} ${
            !cardSquare ? "h-60" : "aspect-square"
          } bg-gray-200 rounded-3xl flex`}
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
      )}
    </View>
  );
};

export default LargeGroupCard;
