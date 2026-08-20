import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ScreenLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: ViewStyle;
}

export function ScreenLayout({ children, noPadding = false, style }: ScreenLayoutProps) {
  return (
    // Trocamos o SafeAreaView por uma View simples que ocupa tudo
    <View style={[styles.container, style]}>
      <View style={[styles.inner, !noPadding && styles.defaultPadding]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  inner: {
    flex: 1,
  },
  defaultPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
  }
});
