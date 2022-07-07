import { Alert, Button, Image, StyleSheet } from 'react-native';
import astronaut from '../assets/images/astr.png';
import { View } from './Themed';

export default function EditHomeScreenInfo() {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Image source={astronaut} style={styles.astr} />
        <Button
          onPress={() => Alert.alert('Simple Button pressed')}
          title="START"
          color="#4f4a75"
          marginTop="20px"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  astr: {
    width: 270,
    height: 250,
    marginBottom: 10,
  },
  btn: {},
  getStartedContainer: {
    alignItems: 'center',
    backgroundColor: '#1A143B',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    backgroundColor: '#1A143B',
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
