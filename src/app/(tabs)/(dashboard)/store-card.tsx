import { Store } from "@/features/store/store.type";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function StoreCard({ store }: { store: Store }) {
  return (
    <View style={styles.card}>

      <Image
        source={{ uri: store.image }}
        style={styles.image}
      />


      <View style={styles.content}>

        <View style={styles.header}>
          <Text style={styles.name}>
            {store.name}
          </Text>

            <Text>Spread 300,000</Text>
        </View>

       <Text style={styles.subtitle}>
            Buy: 13,000,000{"\n"}
            <Text style={styles.subtitle}>
                60,000
            </Text>
        </Text>

        <Text style={styles.delivery}>
            Sell: 12,700,000{"\n"}
            <Text style={styles.subtitle}>
                60,000
            </Text>
        </Text>

       

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            View Store
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginVertical: 5,
  },

  delivery: {
    color: "green",
    marginTop: 5,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#0A84FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});