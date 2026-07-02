import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <View>
      {label ? (
        <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
          {label}
        </Text>
      ) : null}
      <View
        className={[
          'flex-row items-center gap-2 rounded-sm border bg-surface-light-soft px-3.5 dark:bg-base-soft',
          error ? 'border-red-500' : 'border-surface-light-border dark:border-base-border',
        ].join(' ')}>
        {leftIcon}
        <TextInput
          placeholderTextColor="#8a919c"
          className={['flex-1 py-3 text-base text-inkLight dark:text-ink', className ?? ''].join(
            ' '
          )}
          {...props}
        />
        {rightIcon}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
