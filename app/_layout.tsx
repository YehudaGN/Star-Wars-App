import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack  screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
    <Stack.Screen name="PersonDetails/[id]" options={{}} />
  </Stack>;
}
