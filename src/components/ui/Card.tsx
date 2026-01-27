import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  variant = 'default', 
  padding = 'md',
  className, 
  children,
  ...props 
}: CardProps) => {
  const variants = {
    default: "bg-[#0B0B0F]/60 border border-white/5",
    glass: "bg-white/5 border border-white/10 backdrop-blur-md", // backdrop-blur needs polyfill on Android usually, pure NativeWind handles via opacity
    outlined: "bg-transparent border border-white/10",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <View 
      className={`rounded-[32px] ${variants[variant]} ${paddings[padding]} ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
};
