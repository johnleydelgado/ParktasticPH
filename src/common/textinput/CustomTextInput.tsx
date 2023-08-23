import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

const styles = StyleSheet.create({
  input: {
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    // Add other font styles here...
  },
});

const CustomTextInput: React.FC<TextInputProps> = props => (
  <TextInput {...props} style={[styles.input, props.style]} />
);

export default CustomTextInput;
