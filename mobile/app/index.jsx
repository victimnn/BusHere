import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList } from "react-native";

import PopUpComponent from "@mobile/components/PopUpComponent"

export default function IndexScreen() {
  return (
      <View style={styles.container}>
        

        <PopUpComponent ref={popUpRef} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20
	}

});
