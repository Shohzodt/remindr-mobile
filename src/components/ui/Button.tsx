import React from 'react';
import { TouchableOpacity, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  style,
  ...props
}: ButtonProps) => {
  const baseStyles = "flex-row items-center justify-center rounded-2xl active:opacity-90 transition-all";
  
  const sizes = {
    sm: "h-10 px-4",
    md: "h-14 px-6", // Standard Design System Button
    lg: "h-16 px-8 rounded-[24px]", // Hero Button
  };

  const variants = {
    primary: "shadow-xl shadow-purple-500/20", // Gradient handled separately
    secondary: "bg-bg-surface border border-white/10",
    outline: "border border-white/20 bg-transparent",
    ghost: "bg-transparent",
    destructive: "bg-destructive/10 border border-destructive/20",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-white",
    ghost: "text-text-secondary hover:text-white",
    destructive: "text-destructive",
  };

  const Content = () => (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#fff' : '#fff'} />
      ) : (
        <>
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <Text 
            weight="semibold" 
            className={`${textColors[variant]} ${size === 'sm' ? 'text-sm' : 'text-base'}`}
          >
            {label}
          </Text>
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </>
      )}
    </>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        className={`${baseStyles} ${sizes[size]} ${variants.primary} ${className || ''}`}
        activeOpacity={0.9}
        disabled={loading}
        style={style}
        {...props}
      >
        <LinearGradient
          colors={['#8B5CF6', '#d946ef']} // accent-purple to accent-fuchsia
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ 
            width: '100%', 
            height: '100%', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: size === 'lg' ? 24 : 16
          }}
        >
          <Content />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className || ''}`}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      <Content />
    </TouchableOpacity>
  );
};
