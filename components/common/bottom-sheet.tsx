import BottomSheetModalOrigin, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';

import { useAppTheme } from '@/hooks/use-app-theme';

// @gorhom/bottom-sheet doesn't publicly export `BottomSheetModalMethods` from
// its package root, so the ref shape is declared here to match it.
export interface AppBottomSheetRef {
  present: (data?: unknown) => void;
  dismiss: () => void;
  snapToIndex: (index: number) => void;
  snapToPosition: (position: number | string) => void;
  expand: () => void;
  collapse: () => void;
  close: () => void;
  forceClose: () => void;
}

interface AppBottomSheetProps extends Omit<BottomSheetModalProps, 'backgroundStyle' | 'handleIndicatorStyle'> {
  children: React.ReactNode;
}

export const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  function AppBottomSheet({ children, ...props }, ref) {
    const { colors } = useAppTheme();

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    return (
      <BottomSheetModalOrigin
        ref={ref}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.backgroundElevated }}
        handleIndicatorStyle={{ backgroundColor: colors.textFaint }}
        {...props}>
        {children}
      </BottomSheetModalOrigin>
    );
  }
);
