import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) => {
  return (
    <View className="width-full space-y-2">
      {label && (
        <Text variant="caption" weight="medium" className="text-text-secondary ml-1">
          {label}
        </Text>
      )}
      <View 
        className={`flex-row items-center h-14 px-4 bg-bg-surface rounded-2xl border border-white/5 focus:border-accent-purple transition-all ${error ? 'border-destructive' : ''}`}
      >
        {leftIcon && <View className="mr-3 opacity-50">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-base text-text-primary placeholder:text-text-dim h-full"
          placeholderTextColor="#52525b"
          {...props}
        />
        {rightIcon && <View className="ml-3 opacity-50">{rightIcon}</View>}
      </View>
      {error && (
        <Text variant="caption" className="text-destructive ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};
