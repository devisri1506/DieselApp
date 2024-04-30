import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import tw from 'twrnc';

const LoginComponent = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigation = useNavigation();

    const handleSignIn = async () => {
        const email = emailRef.current;
        const password = passwordRef.current;
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Sign In Successful!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const SignInForm = () => {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={text => emailRef.current = text}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={text => passwordRef.current = text}
                    secureTextEntry={true}
                />
                <Button title="Log In" onPress={handleSignIn} disabled={!emailRef.current || !passwordRef.current} />
            </View>
        );
    };

    const handleSignUp = async () => {
        const email = emailRef.current;
        const password = passwordRef.current;
        const auth = getAuth();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Sign Up Successful!');
            navigation.navigate('EmailSignIn');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const SignUpForm = () => {
        return (
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={text => emailRef.current = text}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Create Password"
                    onChangeText={text => passwordRef.current = text}
                    secureTextEntry={true}
                />
                <Button title="Sign Up" onPress={handleSignUp} disabled={!emailRef.current || !passwordRef.current} />
            </View>
        );
    };

    const [isSignUp, setIsSignUp] = useState(false);

    const toggleMode = () => {
        setIsSignUp(prevState => !prevState);
    };

    return (
        <View style={styles.container}>
            <View style={styles.background} />
            <View style={styles.formBlock}>
                <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Welcome back!'}</Text>
                <View style={styles.toggleBlock}>
                    <Text>{isSignUp ? "Already" : "Don't"} have an account? Click here</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isSignUp ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleMode}
                        value={isSignUp}
                    />
                </View>
                {isSignUp ? <SignUpForm /> : <SignInForm />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2C497F', // Initial background color
    },
    formBlock: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        color: 'white',
    },
    toggleBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    form: {
        width: '100%',
    },
    input: {
        fontSize: 15,
        color: 'white',
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, .25)',
        borderRadius: 10,
    },
});

export default LoginComponent;
