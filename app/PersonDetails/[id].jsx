import {
  Button,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { usePeople } from "../../contexts/peopleContext";
import apiFetch from "../../services/apiFetch";
import searchPerson from "../../services/searchPerson";
import { useRouter } from "expo-router";
import PersonDetailItem from "../../components/PersonDetailItem";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

const PersonDetails = () => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  const [person, setPerson] = useState(null);
  const pathname = usePathname();
  const personName = pathname.split("/").pop();
  const { people } = usePeople();
  const [species, setSpecies] = useState(null);
  const [homeworld, setHomeworld] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoader, setInitialLoader] = useState(false);
  const [failedToFetch, setFailedToFetch] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    const fetchedPerson = people.find(person => person.name === personName);
    setPerson(fetchedPerson);
    if (fetchedPerson) {
      fetchAdditionalData(fetchedPerson);
    } else {
      fetchPerson();
    }

    return () => subscription?.remove();
  }, [pathname]);

  const fetchPerson = async () => {
    let jsonResponse;
    try {
      setInitialLoader(true);
      const res = await searchPerson(personName);
      if (res.status === 200) {
        jsonResponse = await res.json();
        setPerson(jsonResponse.results[0]);
        setInitialLoader(false);
      }
    } catch {
      setFailedToFetch(true);
      setInitialLoader(false);
    } finally {
      if (jsonResponse) {
        fetchAdditionalData(jsonResponse.results[0]);
      }
    }
  };

  const fetchAdditionalData = person => {
    getAdditionalInfo(person.species[0], setSpecies);
    getAdditionalInfo(person.homeworld, setHomeworld);
  };

  const getAdditionalInfo = async (path, setInfo) => {
    if (path) {
      try {
        setLoading(true);
        const res = await apiFetch(path);
        setLoading(false);
        if (res.status === 200) {
          const jsonResults = await res.json();
          setInfo(jsonResults);
        } else {
          setInfo(null);
        }
      } catch {
        setInfo(null);
        setLoading(false);
      }
    } else {
      setInfo(null);
    }
  };

  const handleNavigate = () => {
    router.push(`/`);
  };

  const capitalize = word => {
    if (!word) {
      return "No Data";
    } else if (word === "n/a") {
      return word.toUpperCase();
    } else {
      return word[0].toUpperCase() + word.slice(1);
    }
  };

  const capitalizeMultipleWordsInString = string => {
    if (string === "n/a") return "N/A";
    const splitWords = string.split(", ");
    return splitWords.map(word => capitalize(word)).join(", ");
  };

  const convertHeightToFeet = height => {
    if (height === "n/a") return "N/A";
    if (height) {
      const centimeters = Number(height.split(",").join(""));
      const totalInches = centimeters / 2.54; // Convert cm to inches
      const feet = Math.floor(totalInches / 12); // Get the number of feet
      const inches = Math.round(totalInches % 12); // Get the remaining inches, rounded

      return `${feet}'${inches}''`;
    } else {
      return "No Data";
    }
  };

  const convertWeightToLbs = weight => {
    if (weight) {
      return `${Number(weight.split(",").join("") * 2.2).toFixed(1)} lbs`;
    } else {
      return "No Data";
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          {initialLoader && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Loading {personName} Data</Text>
            </View>
          )}
          {person && (
            <View style={styles.parentContainer}>
              <View style={styles.container}>
                {/* Person Details */}
                <PersonDetailItem
                  header={person.name}
                  item={{
                    "Birth Year":
                      person.birth_year === "unknown"
                        ? "Unknown"
                        : person.birth_year,
                    Gender: capitalize(person.gender),
                    "Eye Color": capitalize(person.eye_color),
                    "Skin Color": capitalizeMultipleWordsInString(person.skin_color),
                    "Hair Color": capitalize(person.hair_color),
                    Height: convertHeightToFeet(person.height),
                    Weight: convertWeightToLbs(person.mass),
                  }}
                />

                {homeworld && (
                  // Homeworld Details
                  <PersonDetailItem
                    item={{
                      Homeworld: homeworld.name,
                      Climate: capitalize(homeworld.climate),
                      Gravity: homeworld.gravity,
                      "Orbital Period": `${homeworld.orbital_period} days`,
                      Population: parseInt(
                        homeworld.population,
                        10
                      ).toLocaleString(),
                      Terrain: capitalizeMultipleWordsInString(homeworld.terrain),
                    }}
                  />
                )}
                {species && (
                  // Species Details
                  <PersonDetailItem
                    item={{
                      Species: species.name,
                      Classification: capitalize(species.classification),
                      Designation: capitalize(species.designation),
                      Language: capitalize(species.language),
                      "Eye Colors": capitalizeMultipleWordsInString(
                        species.eye_colors
                      ),
                      "Hair Colors": capitalizeMultipleWordsInString(
                        species.hair_colors
                      ),
                      "Skin Colors": capitalizeMultipleWordsInString(
                        species.skin_colors
                      ),
                      "Average Height": convertHeightToFeet(
                        species.average_height
                      ),
                      "Average Lifespan": species.average_lifespan === 'indefinite' ? 'Indefinite' :`${species.average_lifespan} years`,
                    }}
                  />
                )}
              </View>
              {loading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" />
                  <Text style={styles.loadingText}>Loading More Data</Text>
                </View>
              )}
            </View>
          )}
          {failedToFetch && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No Person</Text>
              <Button
                title="Return to list"
                color="#0F172A"
                onPress={handleNavigate}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  parentContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  container: {
    display: "flex",
    gap: 5,
    width: "95%",
    minWidth: 300,
    maxWidth: 767,
  },
  noResults: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  noResultsText: {
    width: "95%",
    fontSize: 16,
    fontFamily: "Trebuchet MS",
    textAlign: "center",
    color: "#083533",
    marginBottom: 10,
  },
  loader: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loadingText: {
    fontFamily: "Trebuchet MS",
    textAlign: "center",
    color: "#083533",
    marginTop: 20,
  },
});

export default PersonDetails;
