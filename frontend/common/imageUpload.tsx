import { View, Text } from "react-native";
import React from "react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker/src/ImagePicker";

const imgDir = FileSystem.documentDirectory + "images/";

const uploadImage = async (useLibrary: Boolean) => {
  const ensureDirExists = async () => {
    const imgDirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!imgDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
  };

  const selectImg = async (useLibrary: Boolean) => {
    let result;

    if (useLibrary) {
      await ImagePicker.getMediaLibraryPermissionsAsync();

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    } else {
      await ImagePicker.getCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    }
    if (!result.canceled) {
      console.log(result.assets[0].uri, "Test");
    }
  };

  await ensureDirExists();
  await selectImg(useLibrary);
};

export default uploadImage;
