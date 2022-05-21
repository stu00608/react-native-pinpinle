import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function ResultTextRegion(props) {
  const fontSize = 27.5;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={{fontSize: fontSize}}>辨識結果：</Text>
        </View>
        <View style={styles.content}>
          <Text style={{fontSize: fontSize}}>{props.originalText}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={{fontSize: fontSize}}>中文翻譯：</Text>
        </View>
        <View style={styles.content}>
          <Text style={{fontSize: fontSize}}>{props.translatedText}</Text>
        </View>
      </View>
    </View>
  );
}

export default ResultTextRegion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    // backgroundColor: 'white',
    width: '100%',
    height: '40%',
    flexDirection: 'row',
  },
  title: {
    // backgroundColor: 'green',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    // backgroundColor: 'purple',
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
