import { Stack } from "expo-router";
import { PeopleProvider } from "../contexts/peopleContext";
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function RootLayout() {
  const router = useRouter();
  return (
    <PeopleProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#030712",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 26 }}
              >
                Star Wars Info
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="PersonDetails/[id]" options={{}} />
      </Stack>
    </PeopleProvider>
  );
}
