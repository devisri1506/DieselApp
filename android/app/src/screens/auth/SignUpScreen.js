import React from 'react';
import { Button, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();

  const handleEmailSignUp = () => {
    // Navigate to the phone sign-in screen
    navigation.navigate('EmailSignUp');
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title=" Email Sign up"
        onPress={handleEmailSignUp}
      />
      
    </View>
  );
}
