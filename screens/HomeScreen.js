import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="w-full h-full">
      <View className=" bg-blue-900 w-full h-full flex-row items-center justify-center">
        <Text className="text-red-500">Home page</Text>
      </View>
    </View>
  );
}
