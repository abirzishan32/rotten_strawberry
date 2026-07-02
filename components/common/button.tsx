import React from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand dark:bg-brand',
  secondary: 'bg-inkLight/10 dark:bg-ink/10',
  outline: 'bg-transparent border border-inkLight/20 dark:border-ink/20',
  ghost: 'bg-transparent',
  danger: 'bg-red-500/90',
};

const VARIANT_TEXT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-black',
  secondary: 'text-inkLight dark:text-ink',
  outline: 'text-inkLight dark:text-ink',
  ghost: 'text-brand-dim dark:text-brand',
  danger: 'text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-sm',
  md: 'px-5 py-3.5 rounded-md',
  lg: 'px-6 py-4 rounded-md',
};

const SIZE_TEXT_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  ...pressableProps
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPressIn={(e) => {
        scale.value = withTiming(0.96, { duration: 100 });
        pressableProps.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 100 });
        pressableProps.onPressOut?.(e);
      }}
      disabled={isDisabled}
      style={animatedStyle}
      className={[
        'flex-row items-center justify-center gap-2',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50' : '',
      ].join(' ')}
      {...pressableProps}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#00e054'} size="small" />
      ) : (
        <>
          {icon}
          <Text
            className={['font-semibold', SIZE_TEXT_CLASSES[size], VARIANT_TEXT_CLASSES[variant]].join(
              ' '
            )}>
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
