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
import { Stack } from "expo-router";
import searchPerson from "../services/searchPerson";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export default function Home() {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  // const [noSearchResultsInTerm, setNoSearchResultsInTerm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

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
  } = usePagination();

  const renderLoadingFooter = () => {
    if (!loadingMore || data.length < 10) return null;
    return <ActivityIndicator animating size="large" />;
  };

  const handleSearch = async () => {
    if (searchTerm) {
      setLoading(true);
      const res = await searchPerson(searchTerm);
      console.log("res", res);
      setLoading(false);
      if (res.status === 200) {
        const jsonResponse = await res.json();
        console.log("json", jsonResponse);
        if (jsonResponse.count > 0) {
          // Display search results
          setSearchResults(jsonResponse.results);
          setError('');
        } else {
          // Display no results message
          setError('Sorry! There are no results with that search term. Please try again or refresh the page.')
        }
      } else {
        // Display Error
        setError("There was an issue fetching the data. Please try again later.");
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
    setError('');
  };

  return initialLoader || loading ? (
    <View>
      <Stack.Screen
        options={{
          title: "Star Wars Info",
        }}
      />
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Star Wars Info",
          }}
        />

        <View style={styles.searchContainer}>
          <TextInput
          style={styles.searchInput}
            placeholder="Enter a name"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <Button title="Search" onPress={handleSearch} color='#14aea7'/>
        </View>

        <View style={styles.listContainer}>
          {/* Don't display if the user is searching for a specific person */}
          {!searchResults && !error && (
            <FlatList
              style={{
                width: dimensions.window.width,
                display: "flex",
              }}
              data={data}
              renderItem={({ item }) => {
                const personDetails = {
                  name: item.name,
                  birthYear: item.birth_year,
                  gender: item.gender[0].toUpperCase() + item.gender.slice(1),
                  id: item.url.match(/\/people\/(\d+)\//)[1],
                };
                return <PersonItem personDetails={personDetails} />;
              }}
              ListFooterComponent={renderLoadingFooter}
              onEndReached={loadNextPage}
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
          {searchResults && !error && (
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
          {error ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {error}
              </Text>
              <Button title='Refresh' onPress={handleRefreshSearch}/>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    // backgroundColor: 'red',
    width: '100%',
    marginVertical: 10,
    paddingBottom: 10,
    shadowColor: '#676767',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  searchInput: {
    width: 250,
    fontFamily: "Trebuchet MS",
    fontSize: 16,
    paddingLeft: 4,
    color: '#676767',
  }, 
  searchButton: {
    width: 300,
    borderRadius: '50%'
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
    marginBottom: 10
  },
});
