import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api/axios";
import { LOGIN } from "../constants";
import { authContext } from "../contexts/authContext";
import AccountIcon from "../assets/icons/accountIcon";
import LockIcon from "../assets/icons/lockIcon";
import LogoWhite from "../assets/icons/logoWhite";

export default function LoginScreen({ navigation }) {
  const { isLoading, logIn, setIsLoading } = useContext(authContext);

  const [formData, setFormData] = useState({
    username: "ex@gmail.com",
    password: "fortest2020",
  });
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
    logIn(formData, navigation);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className=" h-full w-full">
        <StatusBar style="light" />
        <Image
          className="h-full w-full absolute"
          source={require("../assets/login-bg.png")}
        />

        {/* title and form */}
        <View className="h-full w-full flex justify-center">
          <View className="flex items-center mb-40">
            <Animated.View
              entering={FadeInUp.duration(7000).springify()}
              className="text-white font-bold tracking-wider text-5xl"
            >
              <LogoWhite />
            </Animated.View>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View className="flex items-center mx-4 space-y-4">
              <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
                className="rounded-2xl w-full border-b-2 border-white flex-row items-center"
              >
                <AccountIcon className="ml-5 mb-1" />
                <TextInput
                  value={formData.username}
                  onChangeText={(text) => handleChange(text, "username")}
                  className="text-white text-lg mb-3 ml-5 w-full"
                  placeholder="Введите логин"
                  placeholderTextColor={"white"}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(1000).springify()}
                className="rounded-2xl w-full mb-3 border-b-2 border-white flex-row items-center"
              >
                <LockIcon className="mb-1 ml-5" />
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => handleChange(text, "password")}
                  className="text-white text-lg w-full mb-3 ml-5"
                  placeholder="Введите пароль"
                  placeholderTextColor={"white"}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="w-full"
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  className="w-full bg-white py-4 rounded-2xl mb-3"
                >
                  <Text className="text-xl font-bold text-[#CD5297] text-center">
                    {isLoading ? "Загрузка..." : "Войти"}
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
