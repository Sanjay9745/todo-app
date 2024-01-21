import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
const index = () => {
  const [token, setToken] = React.useState<string>("");
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const token1:any = await AsyncStorage.getItem('token');
        setToken(token1);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchData();
  },[])
  return (
    <>
    {
      token ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />
    }
     
      <Toast />
    </>
  );
};


export default index;
