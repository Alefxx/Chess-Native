import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface NavigationArrowProps {
  direction: 'left' | 'right';
  // No React Native o padrão de nomenclatura é onPress ao invés de onClick
  onPress: () => void; 
  disabled?: boolean;
  // Alterado de className para style
  style?: StyleProp<ViewStyle>; 
}

export function NavigationArrow({ 
  direction, 
  onPress, 
  disabled = false,
  style 
}: NavigationArrowProps) {
  
  // Definindo as cores com base na paleta do Tailwind usada na Web
  const iconColor = disabled ? '#475569' : '#cbd5e1'; // text-slate-600 : text-slate-300

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      // O aria-label vira accessibilityLabel no mobile
      accessibilityLabel={`Navigate ${direction}`}
      // O estilo do Pressable pode receber uma função que detecta se ele está sendo pressionado
      style={({ pressed }) => [
        styles.base,
        disabled ? styles.disabled : styles.enabled,
        // Aplica o estilo de "active" quando pressionado
        pressed && !disabled && styles.pressed,
        style
      ]}
    >
      {direction === 'left' ? (
        <ChevronLeft size={24} color={iconColor} strokeWidth={2.5} />
      ) : (
        <ChevronRight size={24} color={iconColor} strokeWidth={2.5} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    // flex items-center justify-center p-3 rounded-md
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
  },
  disabled: {
    // bg-transparent (o Pressable já é transparente por padrão, mas podemos explicitar)
    backgroundColor: 'transparent',
    // shadow e cursores não se aplicam ou são irrelevantes no mobile desabilitado
  },
  enabled: {
    // sombra base (shadow-sm)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2, // Elevação para Android
  },
  pressed: {
    // active:bg-slate-600
    backgroundColor: '#475569', 
  }
});

