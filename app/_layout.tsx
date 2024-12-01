import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack  screenOptions={{
        headerStyle: {
          backgroundColor: '#0F172A',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        title: 'Star Wars Info'
      }}>
    <Stack.Screen name="PersonDetails/[id]" options={{}} />
  </Stack>;
}
