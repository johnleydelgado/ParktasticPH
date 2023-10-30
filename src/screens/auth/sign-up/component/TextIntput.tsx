import {Box, Input} from 'native-base';
import React, {FC} from 'react';
import {Text} from 'react-native-paper';

interface TextInputProps {
  placeholder: string;
  keyboardType:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
  title: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  value: string;
  error: string | null | undefined;
  isPassword?: boolean;
  otherProps?: any;
}

const TextInput: FC<TextInputProps> = ({
  placeholder,
  keyboardType,
  title,
  onChangeText,
  onBlur,
  value,
  error,
  otherProps,
}) => {
  return (
    <Box pt={2}>
      <Text
        style={{
          fontFamily: 'OpenSans-Regular',
          fontWeight: '500',
          fontSize: 16,
        }}>
        {title}
      </Text>
      <Input
        style={{
          borderColor: 'transparent',
          paddingTop: 8,
          paddingBottom: 8,
          borderWidth: 1,
        }}
        variant="underlined"
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        {...otherProps}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </Box>
  );
};

export default TextInput;
