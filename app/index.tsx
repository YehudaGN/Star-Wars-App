import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";
import PersonItem from "../components/PersonItem";
import usePagination from "../hooks/usePagination";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from 'expo-router';



const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export default function Home() {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

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

  return initialLoader ? (
    <ActivityIndicator size="large" />
  ) : (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Star Wars Info',
        }}
      />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 2,
          }}
        >
          <FlatList
            style={{
              width: dimensions.window.width,
              display: "flex",
            }}
            data={data}
            renderItem={({ item }) => {
              console.log(item);
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
          />
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
  // item: {
  //   backgroundColor: '#f9c2ff',
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  // },
  // title: {
  //   fontSize: 32,
  // },
});
