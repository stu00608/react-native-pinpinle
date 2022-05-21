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

import ResultTextRegion from './components/ResultTextRegion';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const dictionary = require('./dictionary.json');

// State Machine : ready -> scanned/validating -> output -> ready.

function CameraScreen(props) {
  const devices = useCameraDevices();
  const device = devices.back;

  const lastOcrResult = useSharedValue(null);
  const isDetected = useSharedValue(0);
  const lastDetected = useSharedValue(0);
  const lastWord = useSharedValue('');
  const showText = useSharedValue('');
  const translateText = useSharedValue('');
  const [labelText, setLabelText] = useState({origin: '', translated: ''});
  // const [isDetected, setIsDetected] = useState(false);

  Tts.setDefaultRate(0.5);
  Tts.setDefaultPitch(1.02);

  async function processOCRResult(ocrObj) {
    const blocks = ocrObj.result.blocks;
    isDetected.value = blocks.length;
    if (blocks.length > 1) {
      showText.value = '';
      translateText.value = '';
      console.log('More than one blocks detected');
    } else if (blocks.length < 1) {
      showText.value = '';
      translateText.value = '';
      console.log('No Result');
    } else if (blocks.length == 1) {
      var text = blocks[0].text;
      var indexOfNewLine = text.indexOf('\n');
      while (indexOfNewLine != -1) {
        text = text.substring(0, indexOfNewLine);
        indexOfNewLine = text.indexOf('\n');
      }

      // Validation
      if (text.length > 45) {
        console.log('Word is too long.');
        return;
      }
      if (
        dictionary.words.find(item => item === text.toLowerCase()) == undefined
      ) {
        console.log('Word not exist : ', text);
        return;
      }
      if (lastWord.value == text) {
        console.log('Same word detected');
        return;
      }

      // Execute translate and speak out.
      console.log('Run and speak : ', text);
      showText.value = text;
      const trans = await translate(text, {
        from: 'en',
        to: 'zh-tw',
      });
      translateText.value = trans[0];
      await handleSpeak();
    }
    lastWord.value = text;
    setLabel(showText.value, translateText.value);
  }

  async function setLabel(origin, translated) {
    await setLabelText({origin: origin, translated: translated});
  }

  const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  async function handleSpeak() {
    // const voices = await Tts.voices();
    // console.log(voices);
    // await Tts.setDefaultLanguage(voice.language);
    await Tts.stop();
    await Tts.setDefaultLanguage('en-IE');
    await Tts.speak(showText.value);
    await sleep(1000);
    await Tts.setDefaultLanguage('zh-TW');
    await Tts.speak(translateText.value);
  }

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const scannedOcr = scanOCR(frame);

    runOnJS(processOCRResult)(scannedOcr);
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
      <View style={styles.cameraView}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          preset="cif-352x288"
          frameProcessor={frameProcessor}
          frameProcessorFps={0.35}
        />
      </View>

      <ResultTextRegion
        originalText={showText.value}
        translatedText={translateText.value}></ResultTextRegion>
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
