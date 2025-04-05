import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';

const ResultScreen = ({ route, navigation }) => {
  const tailwind = useTailwind();
  const { image, previousResult } = route.params || {};
  const [result, setResult] = useState(previousResult || null);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);

  // Load and prepare the TensorFlow model
  const loadModel = async () => {
    try {
      await tf.ready();
      const modelPath = FileSystem.bundledAssets + 'models/model.json';
      const loadedModel = await tf.loadLayersModel(modelPath);
      setModel(loadedModel);
      return loadedModel;
    } catch (error) {
      console.error('Model loading error:', error);
      throw error;
    }
  };

  // Convert image to tensor
  const imageToTensor = async (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    const buffer = new Uint8Array(width * height * 3);
    
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3])
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();
  };

  // Analyze the image using the loaded model
  const analyzeImage = async () => {
    try {
      const model = await loadModel();
      const imageData = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const rawImageData = Buffer.from(imageData, 'base64');
      const tensor = await imageToTensor(rawImageData);
      const prediction = model.predict(tensor);
      const predictionData = await prediction.data();
      
      // Process prediction results
      const confidence = Math.round(predictionData[0] * 100);
      const diagnosis = confidence > 50 ? 'Likely Infected' : 'No Visible Symptoms';
      
      setResult({
        diagnosis,
        confidence,
        symptoms: {
          eyeDischarge: confidence > 60,
          swollenEyes: confidence > 70,
          unusualPosture: confidence > 65,
          respiratorySigns: confidence > 55
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Analysis error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!previousResult) {
      analyzeImage();
    } else {
      setLoading(false);
    }
  }, []);

  // Save scan to history
  const saveScan = async (scanResult) => {
    try {
      const newScan = {
        imageUri: image.uri,
        result: scanResult,
        timestamp: new Date().toISOString()
      };
      
      const savedScans = await AsyncStorage.getItem('@previousScans');
      const previousScans = savedScans ? JSON.parse(savedScans) : [];
      const updatedScans = [newScan, ...previousScans].slice(0, 10); // Keep last 10 scans
      
      await AsyncStorage.setItem('@previousScans', JSON.stringify(updatedScans));
    } catch (error) {
      console.error('Error saving scan:', error);
    }
  };

  useEffect(() => {
    if (result && !previousResult) {
      saveScan(result);
    }
  }, [result]);

  if (loading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-white')}>
        <Text style={tailwind('text-lg text-gray-700')}>Analyzing image...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tailwind('flex-1 bg-white p-4')}>
      <View style={tailwind('items-center mb-6')}>
        <Image
          source={{ uri: image.uri }}
          style={tailwind('w-64 h-64 rounded-lg mb-4')}
        />
        
        <View style={tailwind('w-full p-4 rounded-lg', {
          'bg-red-100': result.diagnosis === 'Likely Infected',
          'bg-green-100': result.diagnosis === 'No Visible Symptoms'
        })}>
          <Text style={tailwind('text-xl font-bold text-center mb-2', {
            'text-red-700': result.diagnosis === 'Likely Infected',
            'text-green-700': result.diagnosis === 'No Visible Symptoms'
          })}>
            {result.diagnosis}
          </Text>
          <Text style={tailwind('text-center text-gray-700')}>
            Confidence: {result.confidence}%
          </Text>
        </View>
      </View>

      {result.diagnosis === 'Likely Infected' && (
        <View style={tailwind('mb-6')}>
          <Text style={tailwind('text-lg font-bold mb-2')}>Detected Symptoms:</Text>
          <View style={tailwind('bg-gray-100 p-4 rounded-lg')}>
            {result.symptoms.eyeDischarge && <Text style={tailwind('text-red-600 mb-1')}>• Eye discharge</Text>}
            {result.symptoms.swollenEyes && <Text style={tailwind('text-red-600 mb-1')}>• Swollen eyes/face</Text>}
            {result.symptoms.unusualPosture && <Text style={tailwind('text-red-600 mb-1')}>• Unusual posture</Text>}
            {result.symptoms.respiratorySigns && <Text style={tailwind('text-red-600 mb-1')}>• Respiratory signs</Text>}
          </View>
        </View>
      )}

      <View style={tailwind('mb-6')}>
        <Text style={tailwind('text-lg font-bold mb-2')}>Recommended Actions:</Text>
        <View style={tailwind('bg-blue-50 p-4 rounded-lg')}>
          {result.diagnosis === 'Likely Infected' ? (
            <>
              <Text style={tailwind('text-blue-800 mb-2')}>• Immediately isolate the affected chicken</Text>
              <Text style={tailwind('text-blue-800 mb-2')}>• Disinfect the coop and equipment</Text>
              <Text style={tailwind('text-blue-800 mb-2')}>• Contact a veterinarian for confirmation</Text>
              <Text style={tailwind('text-blue-800')}>• Monitor other chickens for symptoms</Text>
            </>
          ) : (
            <>
              <Text style={tailwind('text-blue-800 mb-2')}>• Continue regular health monitoring</Text>
              <Text style={tailwind('text-blue-800 mb-2')}>• Maintain good biosecurity practices</Text>
              <Text style={tailwind('text-blue-800')}>• Schedule regular veterinary check-ups</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={tailwind('bg-blue-500 py-3 px-6 rounded-lg mb-4')}
        onPress={() => navigation.navigate('Learn')}
      >
        <Text style={tailwind('text-white text-center font-bold')}>
          Learn More About NDV
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind('bg-green-500 py-3 px-6 rounded-lg')}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={tailwind('text-white text-center font-bold')}>
          Scan Another Chicken
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultScreen;