
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { app } from './firebase'; // Import Firebase app instance
import LoginScreen from './android/app/src/screens/auth/loginScreen'; // Correct import
import EmailSignInScreen from './android/app/src/screens/auth/EmailSignInScreen'; // Correct import
import EmailSignUpScreen from './android/app/src/screens/auth/EmailSignUpScreen'; // Correct import
import HomeScreen from './android/app/src/screens/Home/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen name="SignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Add more screens here if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
