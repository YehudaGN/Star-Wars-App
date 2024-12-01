import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const PersonItem = props => {
  const { personDetails } = props;
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/PersonDetails/${personDetails.id}`);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container} onPress={handleNavigate}>
        <View style={styles.details}>
          <Text style={[styles.label, styles.nameLabel]}>Name:</Text>
          <Text style={[styles.value, styles.name]}>{personDetails.name}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.label}>Birth Year:</Text>
          <Text style={styles.value}>{personDetails.birthYear}</Text>
        </View>
        <View style={[styles.details, styles.gender]}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{personDetails.gender}</Text>
        </View>
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
    backgroundColor: "#030712",
    width: "95%",
    maxWidth: 500,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginVertical: 4,
    shadowColor: "#676767",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  details: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    maxWidth: 350,
    alignItems: "center",
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Trebuchet MS",
  },
  value: {
    color: "#F3F4F6",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Georgia",
  },
  nameLabel: {
    fontSize: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
  },
});

export default PersonItem;
