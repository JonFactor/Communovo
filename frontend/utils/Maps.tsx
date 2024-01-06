import { View } from "react-native";
import MapView from "react-native-maps";

export const MAP_API_KEY = "AIzaSyCS_zdjnBorQw1PsbhVtsPdTSV1ia9o-_Y";

export const InputMapInfo = () => {
  return <MapView></MapView>;
};

export const OutputMapInfo = () => {
  return <MapView className=" w-60 h-42"></MapView>;
};
