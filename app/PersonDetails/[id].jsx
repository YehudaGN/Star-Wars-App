import {
  Button,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { usePeople } from "../../contexts/peopleContext";
import apiFetch from "../../services/apiFetch";
import searchPerson from "../../services/searchPerson";
import { useRouter } from "expo-router";

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
      <SafeAreaView
        style={[styles.safeArea, { width: dimensions.window.width }]}
      >
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
                <View style={styles.sectionContainer}>
                  <Text style={[styles.detail, styles.header, styles.value]}>
                    {person.name}
                  </Text>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Birth Year:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {person.birth_year === "unknown"
                        ? "Unknown"
                        : person.birth_year}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Gender:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {capitalize(person.gender)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Eye Color:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {capitalize(person.eye_color)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Skin Color:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {capitalize(person.skin_color)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Hair Color:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {capitalize(person.hair_color)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Height:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {convertHeightToFeet(person.height)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <Text style={[styles.detail, styles.key]}>Weight:</Text>
                    <Text style={[styles.detail, styles.value]}>
                      {convertWeightToLbs(person.mass)}
                    </Text>
                  </View>
                </View>

                {homeworld && (
                  <View style={[styles.sectionContainer]}>
                    {/* details on homeworld */}
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Homeworld:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {homeworld.name}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>Climate:</Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalize(homeworld.climate)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>Gravity:</Text>
                      <Text style={[styles.detail, styles.value]}>
                        {homeworld.gravity}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Orbital Period:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {homeworld.orbital_period} days
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Population:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {parseInt(homeworld.population, 10).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>Terrain:</Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalize(homeworld.terrain)}
                      </Text>
                    </View>
                  </View>
                )}
                {/* TODO: Refactor these into reusable components */}
                {species && (
                  <View style={styles.sectionContainer}>
                    {/* details on species */}
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>Species:</Text>
                      <Text style={[styles.detail, styles.value]}>
                        {species.name}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Classification:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalize(species.classification)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Designation:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalize(species.designation)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>Language:</Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalize(species.language)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Eye Colors:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalizeMultipleWordsInString(species.eye_colors)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Hair Colors:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalizeMultipleWordsInString(species.hair_colors)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Skin Colors:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalizeMultipleWordsInString(species.skin_colors)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Average Height:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {convertHeightToFeet(species.average_height)}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Text style={[styles.detail, styles.key]}>
                        Average Lifespan:
                      </Text>
                      <Text style={[styles.detail, styles.value]}>
                        {capitalizeMultipleWordsInString(
                          species.average_lifespan
                        )}{" "}
                        years
                      </Text>
                    </View>
                  </View>
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
    minWidth: 320,
    maxWidth: 767,
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 20,
    backgroundColor: "#030712",
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 20,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  detail: {
    color: "#94A3B8",
    minWidth: 80,
    fontSize: 16,
  },
  key: {},
  value: {
    color: "#F3F4F6",
  },
  header: {
    fontSize: 28,
    fontWeight: 600,
    fontFamily: "Georgia",
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
