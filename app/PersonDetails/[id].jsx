import {
  Button,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { usePeople } from "../../contexts/peopleContext";

const PersonDetails = () => {
  const [person, setPerson] = useState(null);
  const pathname = usePathname();
  const personName = pathname.split("/").pop();
  const { people } = usePeople();

  useEffect(() => {
    const fetchedPerson = people.find(person => person.name === personName);
    setPerson(fetchedPerson);
    console.log(person, fetchedPerson)

    // fetch species, fetch homeworld, fetch starships, fetch vehicles
  }, [pathname]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text>
            {person.name}
          </Text>
          <Text>
            {person.birth_year}
          </Text>
          <Text>
            {person.eye_color}
          </Text>
          <Text>
            {person.gender}
          </Text>
          <Text>
            {person.hair_color}
          </Text>
          <Text>
            {person.homeworld}
          </Text>
          <Text>
            {person.height}
          </Text>
          <Text>
            {person.mass}
          </Text>
          <Text>
            {person.species}
          </Text>
          <Text>
            {person.skin_color}
          </Text>
          <Text>
            {person.starships}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default PersonDetails;
