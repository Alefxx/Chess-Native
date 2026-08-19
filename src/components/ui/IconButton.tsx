// src/components/ui/IconButton.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void; // Atualizado de onClick
  variant?: 'ghost' | 'danger';
}

export function IconButton({ icon, onPress, variant = 'ghost' }: IconButtonProps) {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
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
    padding: 8, // p-2
    borderRadius: 9999, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostPressed: {
    backgroundColor: '#334155', // hover:bg-slate-700
  },
  dangerPressed: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)', // hover:bg-red-900/30
  }
});

