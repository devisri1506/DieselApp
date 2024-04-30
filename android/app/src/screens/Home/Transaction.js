import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, Keyboard, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../../../../firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import { Timestamp } from 'firebase/firestore'; 
import { doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Transaction = () => {
  const [dieselAvailable, setDieselAvailable] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [dieselType, setDieselType] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const [refreshData, setRefreshData] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase not initialized in HomePage");
    }
    fetchDieselAvailable();

  }, []);

  const fetchDieselAvailable = async () => {
    try {
      const dieselDocRef = doc(db, 'diesel', 'ReYlUUhVdqKl3fqhTBBM'); // Replace 'dieselDocumentId' with the actual document ID
      const dieselDocSnapshot = await getDoc(dieselDocRef);
      if (dieselDocSnapshot.exists()) {
        const dieselData = dieselDocSnapshot.data();
        setDieselAvailable(dieselData.dieselAvailable);
      } else {
        console.log("Diesel document does not exist");
      }
    } catch (error) {
      console.error("Error fetching diesel available: ", error);
    }
  };
  
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
      // Retrieve the existing document
      const dieselDocRef = doc(db, 'diesel', 'ReYlUUhVdqKl3fqhTBBM');
  
      // Get the snapshot of the document
      const dieselDocSnap = await getDoc(dieselDocRef);
  
      // Check if the document exists
      if (dieselDocSnap.exists()) {
        // Update the existing document with new data
        await setDoc(dieselDocRef, data, { merge: true });
        console.log("Document updated successfully");
      } else {
        console.log("Diesel document does not exist");
      }
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error updating diesel document: ", error);
      alert(error);
    }
  };
  
  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
  };


    const handleCancel=()=>
    {
        navigation.navigate('Home', { refresh: true });
    }
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
    setRefreshData(true);
    // Reset form fields after saving
    setDieselType(null);
    setQuantity('');
    setCategory('');
    setNote('');
    setDate(new Date());
    navigation.navigate('Home');
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
          <TouchableOpacity onPress={handleCancel} style={styles.saveButton}>
            <Text style={styles.saveText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the parent container fills the entire screen
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
    margin:10,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthContainer: {
    marginRight: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  transactionsRow: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  tableContainer: {
    flex: 1, // Allow the table container to fill the available space
    width: '100%', // Ensure the table container takes up the entire width
    paddingHorizontal: 20, // Add padding for better appearance
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10, // Increase the vertical padding
    paddingHorizontal: 5,
  },
 columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
    alignItems: 'center', // Align items vertically
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10, // Increase the vertical padding
    paddingHorizontal: 5, // Add horizontal padding if needed
    // Alternatively, you can set a fixed height for the cells
    // height: 50, // Adjust the height as needed
  },
  dateColumnHeader: {
    flex: 6, // Increase the width of the date cell
  },
});

export default Transaction;
