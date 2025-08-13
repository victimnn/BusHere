import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        router.replace({
            pathname: '/home',
            params: {email, password}
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
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