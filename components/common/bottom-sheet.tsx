import BottomSheetOrigin, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';

import { useAppTheme } from '@/hooks/use-app-theme';

interface AppBottomSheetProps extends Omit<BottomSheetProps, 'backgroundStyle' | 'handleIndicatorStyle'> {
  children: React.ReactNode;
}

/**
 * Wraps the plain (non-modal) `BottomSheet` rather than `BottomSheetModal`.
 * We only ever show one sheet at a time, scoped to a single screen, so we
 * don't need `BottomSheetModal`'s Portal + present/dismiss stack machinery
 * — that machinery is what got stuck after a close/reopen cycle. This
 * version is fully controlled via the `index` prop (-1 closed, 0+ open),
 * so there's no imperative ref state to lose track of.
 */
export function AppBottomSheet({ children, ...props }: AppBottomSheetProps) {
  const { colors } = useAppTheme();

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetOrigin
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.backgroundElevated }}
      handleIndicatorStyle={{ backgroundColor: colors.textFaint }}
      {...props}>
      {children}
    </BottomSheetOrigin>
  );
}
