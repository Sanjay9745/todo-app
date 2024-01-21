import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SERVER_URL from "../../../constants/SERVER_URL";
import Toast from "react-native-toast-message";

const register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const token:any = await AsyncStorage.getItem('token');
        if(token){
          router.push('/(tabs)/home')
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchData();
  },[])
const handleSubmit = () => {

  axios.post(`${SERVER_URL}/register`, {
    name: name,
    email: email,
    password: password
  })
  .then(async (response)=>{
    if(response.status === 200){
      await AsyncStorage.setItem('token', response.data.token);
      setEmail("")
      setPassword("")
      setName("")
      router.push('/(tabs)/home');
      Toast.show({
        type: "success",
        position: "top",
        text1: "Login Successful",
        text2: "Login Successful",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }else{
      Toast.show({
        type: "error",
        position: "top",
        text1: "Email Already Exist",
        text2: "Email Already Exist",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
  }).catch((error)=>{
    console.log(error);
    Toast.show({
      type: "error",
      position: "top",
      text1: "Email Already Exist",
      text2: "Email Already Exist",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  })
}
  return (
    <SafeAreaView>
      <View className="w-100 h-100 flex justify-center items-center">
        <View>
          <Text className="text-center font-bold text-6xl text-orange-500 mt-40">
            TODO APP
          </Text>
        </View>
        <View>
          <Text className="text-center font-semibold text-2xl">Register</Text>
          <View className="w-100 flex justify-center items-center my-3">
            <Text className="text-start font-medium text-lg self-start ml-1">
            Name
            </Text>
            <TextInput
              onChangeText={(text) => setName(text)}
              value={name}
              className="w-80 h-12 bg-white border-2 border-white shadow-lg rounded-lg pl-2 text-lg"
              placeholder="Enter Name"
            />
          </View>
          <View className="w-100 flex justify-center items-center my-3">
            <Text className="text-start font-medium text-lg self-start ml-1">
              Email
            </Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              className="w-80 h-12 bg-white border-2 border-white shadow-lg rounded-lg pl-2 text-lg"
              placeholder="Enter Email"
            />
          </View>
          <View className="w-100 flex justify-center items-center my-3">
            <Text className="text-start font-medium text-lg self-start ml-1">
              Password
            </Text>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              className="w-80 h-12 bg-white border-2 border-white shadow-lg rounded-lg pl-2 text-lg"
              placeholder="Enter Password"
            />
          </View>
          <View className="w-100 flex justify-center items-center">

          <Pressable
            onPress={handleSubmit}
            className="w-80 h-14 bg-sky-400 flex justify-center items-center rounded-lg mt-10 border-1 border-black  shadow-xl"
          >
            <Text className="font-bold text-lg text-white">Register</Text>
          </Pressable>
          </View>
   
          <Pressable onPress={()=>router.push('/(auth)/login')}>
            <Text className="text-center font-semibold text-lg text-sky-400 mt-4">
              Already have an account? Login
            </Text>
          </Pressable>
        </View>
      </View>
      <Toast/>
    </SafeAreaView>
  );
};

export default register;
