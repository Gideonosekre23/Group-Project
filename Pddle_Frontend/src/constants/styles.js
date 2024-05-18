import {Platform, StyleSheet} from 'react-native';
import {COLORS} from './colors';

export const globalStyles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const fontRegular = Platform.select({
  ios: 'OpenSans-Regular',
  android: 'OpenSans-Regular',
});

const fontBold = Platform.select({
  ios: 'OpenSans-Bold',
  android: 'OpenSans-Bold',
});

const fontItalic = Platform.select({
  ios: 'OpenSans-Italic',
  android: 'OpenSans-Italic',
});

export const theme = {
  textRegular: {
    fontFamily: fontRegular,
  },
  textBold: {
    fontFamily: fontBold,
    fontWeight: 'bold',
  },
  textItalic: {
    fontFamily: fontItalic,
    fontStyle: 'italic',
  },
};
