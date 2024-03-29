import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  
  const handleSignIn = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sign In Successful!');
      navigation.navigate('Home');
      // Navigate to the next screen or perform additional actions upon successful sign-in
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Email and Password Sign-In Screen</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingHorizontal: 10 }}
        placeholder="Enter your email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingHorizontal: 10 }}
        placeholder="Enter your password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
     
      <Button
        title="Sign In"
        onPress={handleSignIn}
        disabled={!email || !password}
        style={{ marginTop: 20 }}
      />
      <Button
        title="Back to Sign-In"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
