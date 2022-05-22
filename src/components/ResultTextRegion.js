import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

function ResultTextRegion(props) {
  const fontSize = 27.5;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={props.onPress}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'rgb(240, 240, 240)' : 'white',
          },
          styles.rowPressable,
        ]}>
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
      </Pressable>
    </View>
  );
}

export default ResultTextRegion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderColor: 'white',
    // borderWidth: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPressable: {
    flex: 1,
    padding: 5,
    width: '100%',
    height: '100%',
    borderColor: 'white',
    // borderWidth: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    // backgroundColor: 'pink',
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
