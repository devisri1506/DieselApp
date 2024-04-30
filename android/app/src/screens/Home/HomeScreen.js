import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, Keyboard, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../../../../firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import { doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';



const HomePage = () => {
  const [dieselAvailable, setDieselAvailable] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize with current date

  const navigation = useNavigation();

  useEffect(() => {  
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase not initialized in HomePage");
    }
    fetchDieselAvailable();
    fetchTransactions();
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

  const fetchTransactions = async () => {
    try {
      const transactionsCollectionRef = collection(db, 'dieselTransactions');
      const querySnapshot = await getDocs(transactionsCollectionRef);
      // When fetching transactions, parse the date string into a Date object
const fetchedTransactions = [];
querySnapshot.forEach(doc => {
  const transactionData = doc.data();
  // Parse the date string into a Date object
  const date = new Date(transactionData.date);
  fetchedTransactions.push({ id: doc.id, ...transactionData, date });
});
setTransactions(fetchedTransactions);

    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  const handleRowClick = (transaction) => {
    // Parse the date string into a Date object
    transaction.date = new Date(transaction.date);
    setSelectedTransaction(transaction);
    setEditingMode(false);
    setEditedTransaction(null);
  };

  const renderGroupedTransactions = () => {
    // Group transactions by month
    const groupedTransactions = transactions.reduce((acc, transaction) => {
      const monthYear = transaction.date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {});

    return Object.entries(groupedTransactions).map(([monthYear, transactions]) => (
      <View key={monthYear}>
        <Text style={styles.monthText}>{monthYear}</Text>
        {transactions.map((transaction, index) => (
          <TouchableOpacity key={index} onPress={() => handleRowClick(transaction)}>
            <View style={styles.transactionRow}>
              <Text>{transaction.date.toLocaleString()}</Text>
              <Text>{transaction.dieselType}</Text>
              <Text>{transaction.quantity} Liters</Text>
              <Text>{transaction.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const handleEdit = () => {
    setEditedTransaction(selectedTransaction);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedTransaction.date || !(editedTransaction.date instanceof Date)) {
        throw new Error('Invalid date');
      }
  
      // Ensure the date property is properly formatted
      const formattedDate = editedTransaction.date.toISOString().split('T')[0];
  
      const updatedTransaction = { ...editedTransaction, date: formattedDate };
  
      await updateDoc(doc(db, 'dieselTransactions', editedTransaction.id), updatedTransaction);
  
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === editedTransaction.id ? updatedTransaction : transaction
      );
      setTransactions(updatedTransactions);
      setEditingMode(false);
      alert('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };
  
  
  

 const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'dieselTransactions', selectedTransaction.id));
      setTransactions(transactions.filter(transaction => transaction.id !== selectedTransaction.id));
      setSelectedTransaction(null);
      alert('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };


  const renderSelectedTransactionCard = () => {
    if (!selectedTransaction) {
      return null;
    }
  
    const transactionToEdit = {... selectedTransaction};
  
   // const date = transactionToEdit.date instanceof Date ? transactionToEdit.date : new Date(transactionToEdit.date);

   if (!transactionToEdit.date) {
    // If date is not set, initialize it with a new Date object
    transactionToEdit.date = new Date();
  }

    return (
      <View style={styles.cardContainer}>
        {showDatePicker && (
          <DateTimePicker
          value={transactionToEdit.date}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false); // Hide date picker after selecting a date 
              if (selectedDate instanceof Date) {
                setEditedTransaction({ ...transactionToEdit, date: selectedDate });
              }
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>Edit Date</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={transactionToEdit.dieselType}
          onChangeText={(text) => setEditedTransaction({ ...transactionToEdit, dieselType: text })}
        />
        <TextInput
          style={styles.input}
          value={transactionToEdit.quantity.toString()}
          onChangeText={(text) => {
            const newValue = text === '' ? '' : parseFloat(text);
            setEditedTransaction({ ...transactionToEdit, quantity: newValue });
          }}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={transactionToEdit.category}
          onChangeText={(text) => setEditedTransaction({ ...transactionToEdit, category: text })}
        />
        <TextInput
          style={styles.input}
          value={transactionToEdit.note}
          onChangeText={(text) => setEditedTransaction({ ...transactionToEdit, note: text })}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveEdit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const handlePlusPress= ()=> {
    navigation.navigate('Transaction');
  };
  

  return (
    <View>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.dieselAvailableText}>Diesel Available: {dieselAvailable.toFixed(2)} Liters</Text>
      {renderGroupedTransactions()}
      {renderSelectedTransactionCard()}
    </ScrollView>
      <TouchableOpacity onPress={(handlePlusPress) } style={styles.plusButton}>
      <Text style={styles.plusText}>+</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieselAvailableText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    width: '48%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default HomePage;
