import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text } from '../Themed';

interface IGivenTextProps {
  text?: string;
  indexOfWord: number;
  indexOfChar: number;
  isItCorrect: boolean;
}

export const GivenText: React.FC<IGivenTextProps> = ({
  text,
  indexOfWord = 0,
  indexOfChar = 0,
  isItCorrect = true,
}) => {
  const [displayedtext, setDisplayedText] = useState<React.ReactNode[]>([]);

  const getSpan = useCallback(
    (
      textStr: string,
      key: number,
      indexOfCharSecond: number,
      correct: boolean
    ) => {
      return (
        <Text
          key={key}
          style={{ color: `${correct === true ? 'green' : 'red'}` }}
        >
          {textStr.substring(0, indexOfCharSecond)}
        </Text>
      );
    },
    []
  );

  useEffect(() => {
    if (!text) {
      return;
    }
    setDisplayedText([]);
    const textArr = text?.split(' ');
    for (let i = 0; i < textArr.length; i += 1) {
      if (i === indexOfWord) {
        setDisplayedText((displayedtextPrev) => [
          ...displayedtextPrev.slice(-10),
          getSpan(textArr[i], i, indexOfChar, isItCorrect),
        ]);
        setDisplayedText((displayedtextPrev) => [
          ...displayedtextPrev,
          textArr[i].substring(indexOfChar, textArr[i].length),
        ]);
        setDisplayedText((displayedtextPrev) => [...displayedtextPrev, ' ']);
      } else if (i > indexOfWord) {
        setDisplayedText((displayedtextPrev) => [
          ...displayedtextPrev,
          textArr[i],
        ]);
        setDisplayedText((displayedtextPrev) => [...displayedtextPrev, ' ']);
      } else {
        setDisplayedText((displayedtextPrev) => [
          ...displayedtextPrev,
          getSpan(textArr[i], i, textArr[i].length, true),
        ]);
        setDisplayedText((displayedtextPrev) => [...displayedtextPrev, ' ']);
      }
    }
  }, [indexOfWord, indexOfChar, isItCorrect, text, getSpan]);

  return (
    <View style={styles.textScrollView}>
      <ScrollView>
        <Text style={styles.text}>{displayedtext}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 30,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  textScrollView: {
    height: 80,
  },
});
