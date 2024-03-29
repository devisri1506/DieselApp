import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../../../../firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import { Timestamp } from 'firebase/firestore'; 
const HomePage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [dieselType, setDieselType] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const [dieselAvailable, setDieselAvailable] = useState(0);

  useEffect(() => {
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase not initialized in HomePage");
    }
  }, []);

  const handleOptionSelect = (option) => {
    setShowOptions(false);
    setDieselType(option);
  };



  const saveDataToFirebase = async(data) => {
    try {
      const docRef = await addDoc(collection(db, 'dieselTransactions'), data);
      console.log("Document written with ID: ", docRef.id);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(error);
    }
  };
  const saveDieselAvailable = async(data) => {
    try {
      const docRef = await addDoc(collection(db, 'diesel'), data);
      console.log("Document written with ID: ", docRef.id);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(error);
    }
  };

  const handleSave = () => {
    // Calculate diesel available based on diesel in/out
    let newDieselAvailable = dieselAvailable;
    if (dieselType === 'Diesel In') {
      newDieselAvailable += parseFloat(quantity);
    } else if (dieselType === 'Diesel Out') {
      newDieselAvailable -= parseFloat(quantity);
    }
    setDieselAvailable(newDieselAvailable);
    const dateString = date.toISOString().split('T')[0]; 
    // Prepare the data object to be saved to Firebase
    const dataToSave = {
      dieselType,
      quantity: parseFloat(quantity),
      category,
      note,
      date: dateString,
    };
    const totalDieselAvailable = {
      dieselAvailable: newDieselAvailable,
    };

    // Call saveDataToFirebase with the data to be saved
    saveDataToFirebase(dataToSave);
    saveDieselAvailable(totalDieselAvailable);
    // Reset form fields after saving
    setDieselType(null);
    setQuantity('');
    setCategory('');
    setNote('');
    setDate(new Date());
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios' || showOptions) {
      return (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowOptions(false);
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dieselAvailableText}>Diesel Available: {dieselAvailable.toFixed(2)} Liters</Text>

      {showOptions ? (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => handleOptionSelect('Diesel In')} style={styles.optionButton}>
            <Text style={styles.optionText}>Diesel In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('Diesel Out')} style={styles.optionButton}>
            <Text style={styles.optionText}>Diesel Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.plusButton}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      )}

      {dieselType && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Quantity (liters)"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Note"
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.label}>Date:</Text>
          <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.datePickerButton}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {renderDatePicker()}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieselAvailableText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 24,
    color: 'white',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
  optionText: {
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
    width: '80%',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerButton: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;
