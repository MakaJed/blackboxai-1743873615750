import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const EducationScreen = () => {
  const tailwind = useTailwind();

  const symptoms = [
    {
      title: 'Eye Discharge',
      description: 'Watery or pus-like discharge from the eyes',
      image: 'https://images.pexels.com/photos/5731864/pexels-photo-5731864.jpeg'
    },
    {
      title: 'Swollen Eyes/Face',
      description: 'Noticeable swelling around eyes and face area',
      image: 'https://images.pexels.com/photos/5731864/pexels-photo-5731864.jpeg'
    },
    {
      title: 'Respiratory Signs',
      description: 'Gasping, coughing, or open-mouth breathing',
      image: 'https://images.pexels.com/photos/5731864/pexels-photo-5731864.jpeg'
    },
    {
      title: 'Unusual Posture',
      description: 'Drooping wings, twisted neck, or other abnormal positions',
      image: 'https://images.pexels.com/photos/5731864/pexels-photo-5731864.jpeg'
    }
  ];

  const preventionTips = [
    'Vaccinate chickens regularly',
    'Maintain clean coops and equipment',
    'Limit visitors to your poultry area',
    'Quarantine new birds for 2-3 weeks',
    'Provide clean water and balanced feed',
    'Disinfect footwear before entering coops'
  ];

  return (
    <ScrollView style={tailwind('flex-1 bg-white p-4')}>
      <Text style={tailwind('text-2xl font-bold mb-4 text-green-800')}>
        Newcastle Disease Information
      </Text>

      <View style={tailwind('mb-6')}>
        <Text style={tailwind('text-lg font-bold mb-2 text-gray-800')}>
          What is Newcastle Disease?
        </Text>
        <Text style={tailwind('text-gray-700 mb-2')}>
          Newcastle disease (ND) is a highly contagious viral disease affecting birds, especially chickens. It spreads rapidly through direct contact with infected birds or contaminated equipment.
        </Text>
      </View>

      <View style={tailwind('mb-6')}>
        <Text style={tailwind('text-lg font-bold mb-2 text-gray-800')}>
          Common Symptoms
        </Text>
        {symptoms.map((symptom, index) => (
          <View key={index} style={tailwind('mb-4')}>
            <Image
              source={{ uri: symptom.image }}
              style={tailwind('w-full h-40 rounded-lg mb-2')}
            />
            <Text style={tailwind('font-bold text-red-600')}>{symptom.title}</Text>
            <Text style={tailwind('text-gray-700')}>{symptom.description}</Text>
          </View>
        ))}
      </View>

      <View style={tailwind('mb-6')}>
        <Text style={tailwind('text-lg font-bold mb-2 text-gray-800')}>
          Prevention Tips
        </Text>
        <View style={tailwind('bg-green-50 p-4 rounded-lg')}>
          {preventionTips.map((tip, index) => (
            <Text key={index} style={tailwind('text-green-800 mb-2')}>
              • {tip}
            </Text>
          ))}
        </View>
      </View>

      <View style={tailwind('mb-6')}>
        <Text style={tailwind('text-lg font-bold mb-2 text-gray-800')}>
          Emergency Contacts
        </Text>
        <View style={tailwind('bg-blue-50 p-4 rounded-lg')}>
          <Text style={tailwind('font-bold text-blue-800 mb-1')}>
            Local Veterinary Office:
          </Text>
          <Text style={tailwind('text-blue-800 mb-2')}>+63 123 456 7890</Text>
          
          <Text style={tailwind('font-bold text-blue-800 mb-1')}>
            Provincial Agriculture Office:
          </Text>
          <Text style={tailwind('text-blue-800 mb-2')}>+63 987 654 3210</Text>
          
          <Text style={tailwind('font-bold text-blue-800 mb-1')}>
            NDV Hotline:
          </Text>
          <Text style={tailwind('text-blue-800')}>1800-NDV-HELP</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EducationScreen;