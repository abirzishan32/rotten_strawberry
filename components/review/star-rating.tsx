import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
}

/** Half-star precision rating, out of 5. Tap left/right half of a star. */
export function StarRating({ rating, onChange, size = 28, color = '#ff8000' }: StarRatingProps) {
  const readOnly = !onChange;

  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const halfFilled = !filled && rating >= star - 0.5;
        const iconName = filled ? 'star' : halfFilled ? 'star-half' : 'star-outline';

        if (readOnly) {
          return <Ionicons key={star} name={iconName} size={size} color={color} />;
        }

        return (
          <View key={star} style={{ width: size, height: size }}>
            <Ionicons name={iconName} size={size} color={color} />
            <View className="absolute inset-0 flex-row">
              <Pressable style={{ width: size / 2, height: size }} onPress={() => onChange(star - 0.5)} />
              <Pressable style={{ width: size / 2, height: size }} onPress={() => onChange(star)} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
