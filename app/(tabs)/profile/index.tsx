import { View, Text, Image , StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import SERVER_URL from "../../../constants/SERVER_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const index = () => {
  const [userDetails, setUserDetails] = React.useState<any>({});
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${SERVER_URL}/user-details`, {
          headers: {
            'x-access-token': token,
          },
        });

        setUserDetails(response.data.user);

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs once, similar to componentDidMount
const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.push('/(auth)/login');
    } catch (error:any) {
      console.error('AsyncStorage error: ' + error.message);
    }
}
  return (
    <SafeAreaView>
      <View className="w-100 h-100 flex justify-center p-5">
        <View className="ml-3">
          <Text className="font-bold text-4xl">Profile</Text>
        </View>
        <View className="w-90 bg-white border-2 border-white shadow-lg h-28 flex flex-row justify-around items-center p-5 my-5 rounded-xl">
          <View>
            <Ionicons style={styles.profile} name="person-circle-outline" size={34} color="black" />
          </View>
          <View >
            <Text className="font-semibold text-lg">{userDetails.name}</Text>
            <Text className="font-semibold text-lg">{userDetails.email}</Text>
          </View>
        </View>
 
          <Pressable onPress={handleLogOut} className="w-90 bg-white border-2 border-white shadow-lg h-18 flex flex-row justify-center items-center p-5 my-5 rounded-xl">

          <Text className="font-semibold text-lg text-center">Log Out</Text>
          </Pressable>

      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  profile: {
    fontSize: 70,
  },
});
export default index;
