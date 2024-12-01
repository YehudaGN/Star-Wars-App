import {
  Button,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from 'expo-router';

// const windowDimensions = Dimensions.get("window");
// const screenDimensions = Dimensions.get("screen");

const PersonItem = props => {
  const { personDetails } = props;
  const router = useRouter();

//   const [dimensions, setDimensions] = useState({
//     window: windowDimensions,
//     screen: screenDimensions,
//   });

//   useEffect(() => {
//     const subscription = Dimensions.addEventListener(
//       "change",
//       ({ window, screen }) => {
//         setDimensions({ window, screen });
//       }
//     );
//     return () => subscription?.remove();
//   });

  const handleNavigate = () => {
    router.push(`/PersonDetails/${personDetails.id}`)
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container} onPress={handleNavigate}>
        <Text style={[styles.details, styles.name]}>
          Name: {personDetails.name}
        </Text>
        <Text style={styles.details}>
          Birth Year: {personDetails.birthYear}
        </Text>
        <Text style={styles.details}>Gender: {personDetails.gender}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    width: "full",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#1dcec6",
    width: "95%",
    maxWidth: 500,
    borderWidth: 1,
    borderColor: '#676767',
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginVertical: 4,
    shadowColor: '#676767',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  details: {
    color: "#083533",
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "Trebuchet MS",
  },
  name: {
    fontSize: 24,
    fontWeight: 500,
    fontFamily: "Georgia",
  },
});

export default PersonItem;
