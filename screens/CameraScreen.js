import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { useTailwind } from 'tailwind-rn';

const CameraScreen = ({ navigation }) => {
  const tailwind = useTailwind();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ base64: true });
      setCapturedImage(photo);
      setShowPreview(true);
    }
  };

  const analyzeImage = () => {
    setShowPreview(false);
    navigation.navigate('Results', { image: capturedImage });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={tailwind('flex-1')}>
      <Camera
        style={tailwind('flex-1')}
        type={Camera.Constants.Type.back}
        ref={ref => setCameraRef(ref)}
      >
        <View style={tailwind('flex-1 bg-black bg-opacity-40 justify-end')}>
          <View style={tailwind('items-center mb-8')}>
            <Text style={tailwind('text-white text-lg mb-4')}>
              Position chicken within frame
            </Text>
            <TouchableOpacity
              style={tailwind('bg-white p-4 rounded-full')}
              onPress={takePicture}
            >
              <View style={tailwind('w-16 h-16 bg-red-500 rounded-full')} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>

      <Modal visible={showPreview} transparent={true}>
        <View style={tailwind('flex-1 bg-black bg-opacity-90 justify-center p-8')}>
          <Image
            source={{ uri: capturedImage?.uri }}
            style={tailwind('w-full h-96 rounded-lg')}
          />
          <View style={tailwind('flex-row justify-between mt-4')}>
            <TouchableOpacity
              style={tailwind('bg-red-500 py-3 px-6 rounded-lg')}
              onPress={() => setShowPreview(false)}
            >
              <Text style={tailwind('text-white font-bold')}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tailwind('bg-green-500 py-3 px-6 rounded-lg')}
              onPress={analyzeImage}
            >
              <Text style={tailwind('text-white font-bold')}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CameraScreen;