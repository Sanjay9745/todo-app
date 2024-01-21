import { View, Text, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import SERVER_URL from "../../../constants/SERVER_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";
interface Todo {
  _id: string;
  task: string;
  isCompleted: boolean;
}
const index = () => {
  const [selected, setSelected] = useState("");
  const [task, setTask] = useState<string>("");
  const [state, setState] = useState<Boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await getToken();

          if (!token) {
            router.push("/(auth)/login");
            return;
          }

          let targetDate = selected || moment().format("YYYY-MM-D");

          const response = await axios.get(
            `${SERVER_URL}/todo-list/${targetDate}`,
            {
              headers: {
                "x-access-token": token,
              },
            }
          );

          if (response.status === 200) {
            setTodos(response.data.todoList);
            setSelected(targetDate);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          await AsyncStorage.removeItem("token");
          router.push("/(auth)/login");
        }
      };

      fetchData();
    }, [router, state, selected])
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    return token;
  };
  const handleAddTodo = async () => {
    const token = await AsyncStorage.getItem("token");
    if (selected === "") {
      const currentDate = moment();

      // Format the date as needed
      const formattedDate = currentDate.format("YYYY-MM-D");
      setSelected(formattedDate);
    }
    axios
      .post(
        `${SERVER_URL}/add-todo-with-date`,
        {
          task,
          date: selected,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setState(!state);
          setTask("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleUpdateTodo = async (id: string, isCompleted: boolean) => {
    const token = await AsyncStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/update-todo`,
        {
          id: id,
          isCompleted: isCompleted,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then(async (response) => {
        if (response.status === 200) {
          setState(!state);
          Toast.show({
            type: "success",
            position: "top",
            text1: "Todo Updated",
            text2: "Todo Updated Successfully",
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTodoDelete = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    axios
      .delete(`${SERVER_URL}/delete-todo/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then(async (response) => {
        if (response.status === 200) {
          setState(!state);
          Toast.show({
            type: "success",
            position: "top",
            text1: "Todo Deleted",
            text2: "Todo Deleted Successfully",
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const parseDate = (date: string) => {
    const inputDate = date;

    // Parse the input date
    const parsedDate = moment(inputDate, 'YYYY-MM-DD');
    
    // Format the date as "MMMM D, YYYY"
    const formattedDate = parsedDate.format('MMMM D, YYYY');
    return formattedDate;
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: { selected: true, disableTouchEvent: true },
          }}
        />
        <View className="mt-5 pl-5 flex flex-row">
          <Text className="text-lg">Add Todo for </Text><Text className="text-lg font-bold">{parseDate(selected)}</Text>
        </View>
        <View className="flex justify-center w-100 items-center space-y-5 m-2">
        <View
          className="flex flex-row justify-between items-center bg-white shadow-lg
        p-3 w-80 border-2 border-white rounded-xl"
        >
          <TextInput
            onChangeText={(text) => setTask(text)}
            value={task}
            className="bg-white  w-60  p-1 rounded-md"
            placeholder="Add Todo"
          ></TextInput>
          <Pressable onPress={handleAddTodo}>
            <Ionicons name="md-add-circle-outline" size={24} color="black" />
          </Pressable>
        </View>
        </View>
        <ScrollView alwaysBounceVertical={true}>
        <View className="flex justify-center w-100 items-center space-y-5 my-10">
          {todos?.map((todo: any, index: any) => {
            return (
              <View
                key={index}
                className="flex flex-row justify-between items-center bg-white shadow-lg
                p-3 w-80 border-2 border-white rounded-xl"
              >
                <Pressable
                  onPress={() => handleUpdateTodo(todo._id, todo.isCompleted)}
                >
                  <View className="w-8 h-8 border-2 border-slate-500 rounded-full flex items-center justify-center">
                    {todo?.isCompleted ? (
                      <Pressable
                        onPress={() =>
                          handleUpdateTodo(todo._id, todo.isCompleted)
                        }
                      >
                        <Ionicons
                          name="checkmark-outline"
                          size={24}
                          color="green"
                        />
                      </Pressable>
                    ) : null}
                  </View>
                </Pressable>
                {
                  todo?.isCompleted ? (
                    <Text className="line-through font-semibold text-lg">{todo?.task}</Text>
                  ) : (
                    <Text className="font-semibold text-lg">{todo?.task}</Text>
                  )
                }
                <Pressable onPress={() => handleTodoDelete(todo._id)}>
                  <Ionicons name="trash-bin-outline" size={24} color="red" />
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default index;
