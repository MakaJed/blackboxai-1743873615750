import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const tailwind = useTailwind();
  const [previousScans, setPreviousScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load previous scans from storage
  const loadScans = async () => {
    try {
      const savedScans = await AsyncStorage.getItem('@previousScans');
      if (savedScans) {
        setPreviousScans(JSON.parse(savedScans));
      }
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  const resumeScan = (scan) => {
    navigation.navigate('Results', { 
      image: { uri: scan.imageUri },
      previousResult: scan.result 
    });
  };

  const startNewScan = () => {
    navigation.navigate('Scan');
  };

  if (loading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center')}>
        <Text style={tailwind('text-lg')}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tailwind('flex-1 p-4')}>
      <Text style={tailwind('text-2xl font-bold mb-6')}>Chicken Health Scanner</Text>
      
      {previousScans.length > 0 ? (
        <>
          <Text style={tailwind('text-lg font-semibold mb-2')}>Previous Scans:</Text>
          <FlatList
            data={previousScans}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={tailwind('p-4 mb-2 rounded-lg', {
                  'bg-red-100': item.result.diagnosis === 'Likely Infected',
                  'bg-green-100': item.result.diagnosis === 'No Visible Symptoms'
                })}
                onPress={() => resumeScan(item)}
              >
                <Text style={tailwind('font-bold')}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
                <Text>
                  {item.result.diagnosis} ({item.result.confidence}%)
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <Text style={tailwind('text-lg mb-4')}>No previous scans found</Text>
      )}

      <TouchableOpacity
        style={tailwind('bg-blue-500 py-3 px-6 rounded-lg mt-4')}
        onPress={startNewScan}
      >
        <Text style={tailwind('text-white text-center font-bold')}>
          Start New Scan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;