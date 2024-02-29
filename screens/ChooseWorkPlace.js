import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api/axios";
import { getPlaces } from "../services/workPlaceService";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants";

export default function ChooseWorkPlace({ navigation }) {
  const [place, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  console.log("selectedPlace: ", selectedPlace);

  const handlePlaceChoose = (place) => setSelectedPlace(place);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPlaces();
        setPlaces(res.results);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = useCallback(() => {
    AsyncStorage.setItem(
      LOCAL_STORAGE_KEYS.SALE_PLACE,
      JSON.stringify(selectedPlace)
    );
    navigation.navigate("Home");
    console.log("Success");
  }, [selectedPlace]);
  return (
    <View
      style={{ backgroundColor: "#f4f6f8" }}
      className="w-full h-full bg-orange-400 flex justify-center items-center"
    >
      <View className="bg-white max-w-sm w-full p-7 rounded-3xl shadow-lg">
        <View className="">
          <Text className="font-bold text-base">
            Пожалуйста, укажите рабочее место
          </Text>
          <Text>
            Реализация будет происходить на продуктах выбранного рабочего местa
          </Text>
        </View>

        <ScrollView className=" mt-5 max-h-56" vertical={true}>
          {place.map((place, i) => (
            <TouchableOpacity
              onPress={() => handlePlaceChoose(place)}
              key={i}
              className="flex flex-row justify-between w-full border-gray-300 border-x-2 border-y-2 rounded-lg p-2 mt-2 items-center"
            >
              <View>
                <Text className="text-base">{place.name}</Text>
                <Text className="">{place.type.name}</Text>
              </View>
              {selectedPlace && selectedPlace.id === place.id && (
                <Icon className="" name="check" size={30} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-sky-400 p-3 rounded-2xl mt-5"
        >
          <Text className="text-white font-bold text-center">Применить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
