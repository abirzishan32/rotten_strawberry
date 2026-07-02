import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal as RNModal, Pressable, Text, View, type ModalProps as RNModalProps } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

interface ModalProps extends Pick<RNModalProps, 'animationType'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children, animationType = 'fade' }: ModalProps) {
  const { colors } = useAppTheme();

  return (
    <RNModal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/60 px-6" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-lg bg-white p-5 dark:bg-base-elevated">
          {title ? (
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-inkLight dark:text-ink">{title}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </Pressable>
            </View>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
