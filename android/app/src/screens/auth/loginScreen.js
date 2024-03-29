import React from 'react';
import { Button, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleSignUp = () => {
    // Navigate to the phone sign-in screen
    navigation.navigate('SignUp');
  };
  

  const handleEmailSignIn = () => {
    // Navigate to the phone sign-in screen
    navigation.navigate('EmailSignIn');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Sign up"
        onPress={handleSignUp}
      />
      <Button
        title="Sign in"
        onPress={handleEmailSignIn}
      />
    </View>
  );
}
