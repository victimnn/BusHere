import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from "react-native";


export default function IndexScreen() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/auth/login');
  };

  return (
      <View style={styles.container}>
        <Button onPress={handleNavigate} title="Navigate" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
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
