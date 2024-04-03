import React, { useCallback, useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { workPlaceContext } from "../contexts/workPlaceContext";

export default function ChooseWorkPlace({ navigation }) {
  const { places, selectedPlace, setSelectedPlace, handleSave, getPlaces } = useContext(workPlaceContext);
  const [disabledStyle, setDisabledStyle] = useState(null);

  const handlePlaceChoose = (place) => setSelectedPlace(place);

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    if (!selectedPlace) {
      setDisabledStyle({ opacity: 0.5 });
    } else {
      setDisabledStyle({ opacity: 1 });
    }
  }, [selectedPlace]);

  return (
    <ImageBackground
      source={require("../assets/places-bg.png")}
      resizeMode="cover"
      style={{ backgroundColor: "#f4f6f8" }}
      className="w-full h-full bg-orange-400 flex justify-center items-center"
    >
      <Pressable onPress={() => setSelectedPlace(null)} className="bg-white max-w-sm w-full p-7 rounded-3xl shadow-lg">
        <View className="">
          <Text className="font-bold text-base">Пожалуйста, укажите рабочее место</Text>
          <Text>Реализация будет происходить на продуктах выбранного рабочего местa</Text>
        </View>

        <ScrollView className=" mt-5 h-56" vertical={true}>
          {places.map((place, i) => (
            <TouchableOpacity
              onPress={() => handlePlaceChoose(place)}
              key={i}
              className="flex flex-row justify-between w-full border-[#7E8BCD] border-x-2 border-y-2 rounded-lg p-2 mt-2 items-center"
            >
              <View>
                <Text className="text-base">{place.name}</Text>
                <Text className="">{place.type.name}</Text>
              </View>
              {selectedPlace && selectedPlace.id === place.id && <Icon color={"#7E8BCD"} name="check" size={30} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={disabledStyle} disabled={!selectedPlace} onPress={() => handleSave(navigation)}>
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 mt-5">
            <Text className="text-xl font-bold text-white text-center">Применить</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Pressable>
    </ImageBackground>
  );
}
