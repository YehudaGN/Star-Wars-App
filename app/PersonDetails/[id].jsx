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
import apiFetch from "../../services/apiFetch";

const PersonDetails = () => {
  const [person, setPerson] = useState(null);
  const pathname = usePathname();
  const personName = pathname.split("/").pop();
  const { people } = usePeople();
  const [species, setSpecies] = useState("");
  const [homeworld, setHomeworld] = useState("");

  useEffect(() => {
    const fetchedPerson = people.find(person => person.name === personName);
    setPerson(fetchedPerson);
    console.log(person, fetchedPerson);
    getAdditionalInfo(fetchedPerson.species[0], setSpecies);
    getAdditionalInfo(fetchedPerson.homeworld, setHomeworld);
    // fetch species, fetch homeworld, fetch starships, fetch vehicles
  }, [pathname]);

  const getAdditionalInfo = async (path, setInfo) => {
    if (path) {
      try {
        console.log(" url", path);
        const res = await apiFetch(path);
        if (res.status === 200) {
          const jsonResults = await res.json();
          console.log(jsonResults);
          setInfo(jsonResults.name);
        } else {
          setInfo("No Data");
        }
      } catch {
        setInfo("No Data");
      }
    } else {
      setInfo("No Data");
    }
  };

  if (person) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.detailContainer}>
            <Text>name</Text>
            <Text>{person.name}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>birth_year</Text>
            <Text>{person.birth_year}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>eye_color</Text>
            <Text>{person.eye_color}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>gender</Text>
            <Text>{person.gender}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>hair_color</Text>
            <Text>{person.hair_color}</Text>
          </View>

          <View>
            {/* details on homeworld */}
            <View style={styles.detailContainer}>
              <Text>homeworld</Text>
              <Text>{homeworld}</Text>
            </View>
          </View>

          <View style={styles.detailContainer}>
            <Text>height</Text>
            <Text>{person.height}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>mass</Text>
            <Text>{person.mass}</Text>
          </View>

          <View>
            {/* details on species */}
            <View style={styles.detailContainer}>
              <Text>species</Text>
              <Text>{species}</Text>
            </View>
          </View>

          <View style={styles.detailContainer}>
            <Text>skin_color</Text>
            <Text>{person.skin_color}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text>starships</Text>
            <Text>{person.starships.length ? person.starships : 'No Data'}</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return (
      <View>
        <Text>No Person</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    display: "flex",
    gap: 5,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 20,
    backgroundColor: "red",
  },
});

export default PersonDetails;
