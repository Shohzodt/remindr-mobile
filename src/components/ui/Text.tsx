import { Text as RNText, TextProps } from 'react-native';

// Removed unused cn import if we aren't using it yet

interface TypographyProps extends TextProps {
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'micro';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string; // Tailwind color class, e.g., 'text-primary'
  className?: string;
}

export const Text = ({ 
  variant = 'body', 
  weight, 
  color = 'text-primary',
  className, 
  style,
  ...props 
}: TypographyProps) => {
  // Map variants to specific default weights if not explicitly provided
  const defaultWeights: Record<string, NonNullable<TypographyProps['weight']>> = {
    hero: 'extrabold',
    h1: 'extrabold', // Design System titles are usually heavy
    h2: 'bold',
    h3: 'bold',
    body: 'normal',
    caption: 'medium',
    micro: 'extrabold', // Verified: Micro is 800 weight
  };

  const activeWeight = weight || defaultWeights[variant] || 'normal';
  const variants = {
    hero: 'text-5xl tracking-tighter leading-none',
    h1: 'text-4xl tracking-tighter',
    h2: 'text-3xl tracking-tight',
    h3: 'text-xl tracking-tight',
    body: 'text-base',
    caption: 'text-xs',
    micro: 'text-[10px] uppercase tracking-[2px]',
  };

  const weights = {
    normal: 'font-sans font-normal',
    medium: 'font-sans-medium font-medium',
    semibold: 'font-sans-semibold font-semibold',
    bold: 'font-sans-bold font-bold',
    extrabold: 'font-sans-extrabold font-extrabold',
  };

  return (
    <RNText 
      className={`
        ${variants[variant]} 
        ${weights[activeWeight]} 
        ${color} 
        ${className || ''}
      `}
      style={style}
      {...props} 
    />
  );
};
