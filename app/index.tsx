import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  RefreshControl,
  TextInput,
  Button,
  Text,
} from "react-native";
import PersonItem from "../components/PersonItem";
import usePagination from "../hooks/usePagination";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import searchPerson from "../services/searchPerson";
import { usePeople } from "../contexts/peopleContext";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export default function Home() {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  const { people, setPeople } = usePeople();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  }, []);

  const {
    data,
    totalResult,
    refreshing,
    loadingMore,
    handleRefresh,
    loadNextPage,
    initialLoader,
    fetchError,
  } = usePagination();

  const renderLoadingFooter = () => {
    if (!loadingMore || data.length < 10) return null;
    return <ActivityIndicator animating size="large" />;
  };

  const handleSearch = async () => {
    if (searchTerm) {
      setLoading(true);
      try {
        const res = await searchPerson(searchTerm);
        setLoading(false);
        if (res.status === 200) {
          const jsonResponse = await res.json();
          if (jsonResponse.count > 0) {
            // Display search results
            setSearchResults(jsonResponse.results);
            setPeople([...people, ...jsonResponse.results]);
            setError("");
          } else {
            // Display no results message
            setError(
              "Sorry! There are no results with that search term. Please try again or refresh the page."
            );
          }
        } else {
          // Display Error
          setError(
            "There was an issue fetching the data. Please try again later."
          );
        }
      } catch {
        // Display Error
        setLoading(false);
        setError(
          "There was an issue fetching the data. Please try again later."
        );
      }
    } else {
      if (searchResults) {
        handleRefreshSearch();
      }
    }
  };

  const handleRefreshSearch = () => {
    setSearchResults(null);
    setSearchTerm("");
    setError("");
  };

  return initialLoader || loading ? (
    <View style={styles.initialLoader}>
      <ActivityIndicator size="large" />
      <Text style={styles.initialLoaderText}>Loading list</Text>
    </View>
  ) : (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter a name"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <Button title="Search" onPress={handleSearch} color="#0F172A" />
        </View>

        <View style={styles.listContainer}>
          {/* Don't display if the user is searching for a specific person */}
          {!searchResults && !error && !fetchError && (
            <FlatList
              style={{
                width: dimensions.window.width,
                display: "flex",
              }}
              data={data}
              renderItem={({ item }) => {
                const personDetails = {
                  name: item.name,
                  birthYear:
                    item.birth_year === "unknown" ? "Unknown" : item.birth_year,
                  gender:
                    item.gender === "n/a"
                      ? "N/A"
                      : item.gender[0].toUpperCase() + item.gender.slice(1),
                };
                return <PersonItem personDetails={personDetails} />;
              }}
              ListFooterComponent={renderLoadingFooter}
              onEndReached={() => {
                if (totalResult > data.length) {
                  loadNextPage();
                }
              }}
              onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          )}
          {/* Display search results */}
          {searchResults && !error && !fetchError && (
            <FlatList
              style={{
                width: dimensions.window.width,
                display: "flex",
              }}
              data={searchResults}
              renderItem={({ item }) => {
                const personDetails = {
                  name: item.name,
                  birthYear: item.birth_year,
                  gender: item.gender[0].toUpperCase() + item.gender.slice(1),
                  id: item.url.match(/\/people\/(\d+)\//)[1],
                };
                return <PersonItem personDetails={personDetails} />;
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefreshSearch}
                />
              }
            />
          )}
          {/* Display errors */}
          {error || fetchError ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{error || fetchError}</Text>
              {error ? (
                <Button
                  title="Refresh"
                  onPress={handleRefreshSearch}
                  color="#0F172A"
                />
              ) : (
                <Button
                  title="Refresh"
                  onPress={handleRefresh}
                  color="#0F172A"
                />
              )}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  initialLoader: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAF9",
  },
  initialLoaderText: {
    fontFamily: "Trebuchet MS",
    textAlign: "center",
    color: "#083533",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: "100%",
    paddingVertical: 10,
    boxShadow: `-2px 4px 6px rgba(103, 103, 103, 0.2)`,
  },
  searchInput: {
    width: 250,
    fontFamily: "Trebuchet MS",
    fontSize: 16,
    paddingLeft: 4,
    paddingVertical: 8,
    color: "#676767",
  },
  searchButton: {
    width: 300,
    borderRadius: "50%",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  noResults: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  noResultsText: {
    width: "95%",
    fontSize: 16,
    fontFamily: "Trebuchet MS",
    textAlign: "center",
    color: "#083533",
    marginBottom: 10,
  },
});
