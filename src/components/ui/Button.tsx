// src/components/ui/Button.tsx
import React from 'react';
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress?: () => void; // onClick vira onPress
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>; // className vira style
  textStyle?: StyleProp<TextStyle>; // Bônus: permitimos customizar o texto
}

export function Button({ 
  label, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  style,
  textStyle
}: ButtonProps) {
  
  return (
    <Pressable
      onPress={onPress}
      // O Pressable permite acessar o estado de "pressionado" para simular o active:scale-95
      style={({ pressed }) => [
        styles.base,
        styles[`${variant}Bg`], // Pega a cor de fundo pelo variant
        styles[`${size}Container`], // Pega o padding pelo size
        pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 }, // Efeito de clique
        style
      ]}
    >
      <Text style={[
        styles.textBase,
        styles[`${variant}Text`], // Pega a cor do texto pelo variant
        styles[`${size}Text`], // Pega o tamanho da fonte pelo size
        textStyle
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8, // rounded-md
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-md
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textBase: {
    fontWeight: 'bold',
  },
  // --- VARIANTS ---
  primaryBg: { backgroundColor: '#88c425' }, // bg-chess-green
  primaryText: { color: '#0f172a' }, // text-slate-900
  
  secondaryBg: { backgroundColor: '#334155' }, // bg-slate-700
  secondaryText: { color: '#ffffff' },
  
  dangerBg: { backgroundColor: '#dc2626' }, // bg-red-600
  dangerText: { color: '#ffffff' },

  // --- SIZES ---
  smContainer: { paddingHorizontal: 12, paddingVertical: 4 }, // px-3 py-1
  smText: { fontSize: 14 }, // text-sm
  
  mdContainer: { paddingHorizontal: 24, paddingVertical: 8 }, // px-6 py-2
  mdText: { fontSize: 16 }, // text-base
  
  lgContainer: {
  minWidth: 260,
  minHeight: 64,
  paddingHorizontal: 40,
  paddingVertical: 16,
},

lgText: {
  fontSize: 20,
  fontWeight: '700',
},
});

