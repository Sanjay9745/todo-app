import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";

export default function Layout() {
  NativeWindStyleSheet.setOutput({
    default: "native",
  });
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
