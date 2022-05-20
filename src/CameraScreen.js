import Reanimated, {runOnJS, useSharedValue} from 'react-native-reanimated';
import React, {useState, setState} from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import translate from 'translate-google-api';
import Tts from 'react-native-tts';

import {scanOCR} from 'vision-camera-ocr';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen(props) {
  const devices = useCameraDevices();
  const device = devices.back;

  const ocrResult = useSharedValue('');
  const [ocrText, setShowText] = useState('');
  const [translateText, setTranslateText] = useState('');
  const [ttsStatus, setTtsStatus] = useState('');

  // Tts.addEventListener('tts-start', event => setTtsStatus('start'));
  // Tts.addEventListener('tts-finish', event => setTtsStatus('finished'));
  // Tts.addEventListener('tts-cancel', event => setTtsStatus('canceled'));
  // Tts.getInitStatus();
  Tts.setDefaultRate(0.5);
  Tts.setDefaultPitch(1.02);
  Tts.setDefaultLanguage('zh-TW');

  async function processOCRResult(text) {
    console.log('Reading = ', text);
    if (text === '') {
      setShowText('');
      setTranslateText('');
      return;
    }
    setShowText(text);
    const trans = await translate(text, {
      from: 'en',
      to: 'zh-tw',
    });
    // console.log(trans);
    setTranslateText(trans[0]);

    // console.log('tts', ttsStatus);
  }

  async function getCameraPermission() {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    setPermissionMsg(cameraPermission);
  }

  async function requestCameraPermission() {
    const newCameraPermission = await Camera.requestCameraPermission();
    const availavleDevices = await Camera.getAvailableCameraDevices();
    await getCameraPermission();
  }

  async function handleSpeak() {
    // const voices = await Tts.voices();
    // console.log(voices);
    // await Tts.setDefaultLanguage(voice.language);
    console.log('In handleSpeak : ', translateText);
    console.log(typeof translateText);
    Tts.speak(translateText);
  }

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedOcr = scanOCR(frame);
    // console.log(scannedOcr);
    runOnJS(processOCRResult)(scannedOcr.result.text);

    // ocrResult.value = scannedOcr.result.text;

    // setOcrResult(scannedOcr.result.text);
    // console.log(scannedOcr.result.text);
    // console.log(scannedOcr.result.text);
  }, []);

  if (device == null) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Reanimated.View style={styles.cameraView}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          preset="medium"
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
        />
      </Reanimated.View>
      <View style={styles.detectedResult}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleSpeak}>
          <View>
            <Text numberOfLines={1}>OCR Result = {ocrText}</Text>
            <Text numberOfLines={1}>To Chinese = {translateText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "pink",
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  cameraView: {
    flex: 3,
    // backgroundColor: "green",
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    width: width,
    height: height,
  },
  filter: {
    backgroundColor: 'grey',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  block: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '75%',
    height: 50,
  },
  detectedResult: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  homeBtnGroup: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  slogan: {
    position: 'relative',
    // backgroundColor: "orange",
    width: '100%',
    fontSize: 35,
    top: -40,
    fontWeight: 'bold',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    textShadowColor: 'white',
  },
  startBtn: {
    width: '75%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
    margin: 10,
  },
  startBtnPressed: {
    opacity: 0.85,
  },
  startBtnReleased: {
    opacity: 1.0,
  },
});
