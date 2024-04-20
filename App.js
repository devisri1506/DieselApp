
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { app } from './firebase'; // Import Firebase app instance
import EmailSignInScreen from './android/app/src/screens/auth/EmailSignInScreen'; // Correct import
import HomeScreen from './android/app/src/screens/Home/HomeScreen';
import Transaction from './android/app/src/screens/Home/Transaction';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transaction" component={Transaction} />
        {/* Add more screens here if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
