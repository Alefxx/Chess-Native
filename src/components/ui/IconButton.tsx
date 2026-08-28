// src/components/ui/IconButton.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void; // Atualizado de onClick
  variant?: 'ghost' | 'danger';
  accessibilityLabel?: string;
  disabled?: boolean;
}

export function IconButton({ icon, onPress, variant = 'ghost', accessibilityLabel = 'Ação', disabled = false }: IconButtonProps) {
  return (
    <Pressable 
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        pressed && variant === 'ghost' && styles.ghostPressed,
        pressed && variant === 'danger' && styles.dangerPressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    borderRadius: 9999, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
  ghostPressed: {
    backgroundColor: '#334155', // hover:bg-slate-700
  },
  dangerPressed: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)', // hover:bg-red-900/30
  }
});

