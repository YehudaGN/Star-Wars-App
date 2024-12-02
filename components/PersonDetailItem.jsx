import { Text, View, StyleSheet } from "react-native";

const PersonDetailItem = props => {
  const { header, item } = props;

  const itemDetails = Object.keys(item).map((key, index) => (
    <View style={styles.detailContainer} key={index}>
      <Text style={[styles.detail, styles.key]}>{key}:</Text>
      <Text style={[styles.detail, styles.value]}>{item[key]}</Text>
    </View>
  ));

  return (
    <View style={styles.sectionContainer}>
      {header && (
        <Text style={[styles.detail, styles.header, styles.value]}>
          {header}
        </Text>
      )}
      {itemDetails}
    </View>
  );
};

const styles = StyleSheet.create({
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
    minWidth: 110,
    fontSize: 16,
  },
  value: {
    color: "#F3F4F6",
  },
  header: {
    fontSize: 28,
    fontWeight: 600,
    fontFamily: "Georgia",
  },
});

export default PersonDetailItem;
