import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import MapModal from "../components/modals/MapModal";

export const MAP_API_KEY = "AIzaSyCS_zdjnBorQw1PsbhVtsPdTSV1ia9o-_Y";

export const InputMapInfo = ({ regionSetter }) => {
  const [viewMapModal, setViewMapModal] = useState(false);
  return (
    <View className=" w-60 aspect-square ">
      <Modal visible={viewMapModal}>
        <MapModal
          parentSetter={setViewMapModal}
          input={true}
          location={null}
          passedRegion={null}
          regionSetter={regionSetter}
        />
      </Modal>
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => {
          setViewMapModal(true);
        }}
      >
        <Text style={styles.openBtnText}>Open Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export const OutputMapInfo = ({ location, eventRegion }) => {
  const [viewMapModal, setViewMapModal] = useState(false);
  return (
    <View>
      <Modal visible={viewMapModal}>
        <MapModal
          parentSetter={setViewMapModal}
          input={false}
          location={location}
          passedRegion={eventRegion}
          regionSetter={(param) => {}}
        />
      </Modal>
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => {
          setViewMapModal(true);
        }}
      >
        <Text style={styles.openBtnText}>Open Map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  openBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#B8C0FF",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 10,
  },
  openBtnText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});
