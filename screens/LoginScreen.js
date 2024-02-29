import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";

import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { userLogin } from "../api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api/axios";
import { LOGIN } from "../constants";

export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  let [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const handleChange = (text, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: text.toLowerCase(),
    }));
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };
  const handleLogin = async () => {
    if (!validateEmail(formData.username)) {
      Alert.alert("Ошибка", "Введите корректный адрес электронной почты");
      return;
    }
    if (!validatePassword(formData.password)) {
      Alert.alert("Ошибка", "Пароль должен содержать не менее 6 символов");
      return;
    }
    setLoading(true);
    try {
      let res = await api.post(LOGIN, formData);
      await AsyncStorage.setItem("_ss:access", res.data.token);
      setLoading(false);

      navigation.navigate("WorkPlaces");
    } catch (error) {
      setLoading(false);

      console.log("error: ", error);
      // setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-white h-full w-full">
        <StatusBar style="light" />
        <Image
          className="h-full w-full absolute"
          source={require("../assets/background.png")}
        />
        <View className="flex-row justify-around w-full absolute">
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
            className="h-[225] w-[90]"
            source={require("../assets/light.png")}
          />
          <Animated.Image
            entering={FadeInUp.delay(400).duration(1000).springify().damping(2)}
            className="h-[160] w-[65]"
            source={require("../assets/light.png")}
          />
        </View>

        {/* title and form */}
        <View className="h-full w-full flex justify-around pt-40 pb-10">
          <View className="flex items-center">
            <Animated.Text
              entering={FadeInUp.duration(1000).springify()}
              className="text-white font-bold tracking-wider text-5xl"
            >
              Smarty-Sell
            </Animated.Text>
          </View>
          <KeyboardAvoidingView behavior="padding" secureTextEntry={false}>
            <View className="flex items-center mx-4 space-y-4">
              <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
                className="bg-gray-100 rounded-2xl w-full"
              >
                <TextInput
                  value={formData.username}
                  onChangeText={(text) => handleChange(text, "username")}
                  className="p-5"
                  placeholder="Ваша почта"
                  placeholderTextColor={"gray"}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(1000).springify()}
                className="bg-gray-100 rounded-2xl w-full mb-3"
              >
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => handleChange(text, "password")}
                  className="p-5"
                  placeholder="Ваш пароль"
                  placeholderTextColor={"gray"}
                  secureTextEntry
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="w-full"
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                >
                  <Text className="text-xl font-bold text-white text-center">
                    {loading ? "Загрузка..." : "Войти"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
