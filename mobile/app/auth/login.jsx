import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList } from "react-native";
import { useRouter } from 'expo-router';


export default function Login() {
    const router = useRouter();

    const handleLogin = () => {
        // Perform login logic
        router.replace('/home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});