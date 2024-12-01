import { Stack } from "expo-router";
import { PeopleProvider } from "../contexts/peopleContext";

export default function RootLayout() {
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
          title: "Star Wars Info",
        }}
      >
        <Stack.Screen name="PersonDetails/[id]" options={{}} />
      </Stack>
    </PeopleProvider>
  );
}
