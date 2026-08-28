import React from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme, MaxContentWidth } from '@/constants/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
  keyboardAware?: boolean;
}

export function ScreenLayout({ children, noPadding = false, style, keyboardAware = false }: ScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
      <KeyboardAvoidingView
        enabled={keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.inner, !noPadding && styles.defaultPadding, style]}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth + 64,
    alignSelf: 'center',
  },
  defaultPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  }
});
