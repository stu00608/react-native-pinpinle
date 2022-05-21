import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import CameraScreen from './src/CameraScreen.tsx';

export default function App() {
  // const [permission, setPermissionMsg] = useState(null);
  // const [appState, setAppState] = useState('Welcome');

  // async function getCameraPermission() {
  //   const cameraPermission = await Camera.getCameraPermissionStatus();
  //   setPermissionMsg(cameraPermission);
  // }

  // async function requestCameraPermission() {
  //   const newCameraPermission = await Camera.requestCameraPermission();
  //   await getCameraPermission();
  //   if (permission == 'authorized') {
  //     setAppState('Camera');
  //   }
  // }

  // if (appState == 'Welcome') {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.cameraView}></View>
  //       <View style={styles.detectedResult}>
  //         <TouchableOpacity
  //           style={styles.startBtn}
  //           onPress={requestCameraPermission}>
  //           <View>
  //             <Text>Start</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // } else if (appState == 'Camera') {
  //   return (
  //     <GestureHandlerRootView style={{flex: 1}}>
  //       <CameraScreen></CameraScreen>
  //     </GestureHandlerRootView>
  //   );
  // }

  const [permission, setPermission] = useState(false);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status === 'authorized');
    })();
  }, []);

  return permission ? (
    <GestureHandlerRootView style={{flex: 1}}>
      <CameraScreen></CameraScreen>
    </GestureHandlerRootView>
  ) : null;
}

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
    flex: 2,
    // backgroundColor: "green",
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
