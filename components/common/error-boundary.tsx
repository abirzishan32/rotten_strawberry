import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-8 dark:bg-base">
          <Text className="mb-2 text-center text-lg font-semibold text-inkLight dark:text-ink">
            Something went wrong
          </Text>
          <Text className="mb-6 text-center text-sm text-inkLight-muted dark:text-ink-muted">
            {this.state.error.message}
          </Text>
          <Button label="Try again" onPress={this.reset} />
        </View>
      );
    }

    return this.props.children;
  }
}
