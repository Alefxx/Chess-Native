// src/components/ui/Button.tsx
import React from 'react';
import { ActivityIndicator, Text, Pressable, StyleSheet, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { AppTheme } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void; // onClick vira onPress
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>; // className vira style
  textStyle?: StyleProp<TextStyle>; // Bônus: permitimos customizar o texto
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function Button({ 
  label, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel
}: ButtonProps) {
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      // O Pressable permite acessar o estado de "pressionado" para simular o active:scale-95
      style={({ pressed }) => [
        styles.base,
        styles[`${variant}Bg`], // Pega a cor de fundo pelo variant
        styles[`${size}Container`], // Pega o padding pelo size
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? AppTheme.background : AppTheme.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[
            styles.textBase,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle
          ]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-md
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
    elevation: 0,
  },
  textBase: {
    fontWeight: 'bold',
  },
  // --- VARIANTS ---
  primaryBg: { backgroundColor: AppTheme.primary },
  primaryText: { color: AppTheme.background },
  
  secondaryBg: { backgroundColor: AppTheme.surfaceRaised, borderWidth: 1, borderColor: AppTheme.border },
  secondaryText: { color: AppTheme.text },
  
  dangerBg: { backgroundColor: AppTheme.danger },
  dangerText: { color: AppTheme.text },

  ghostBg: { backgroundColor: 'transparent', borderWidth: 1, borderColor: AppTheme.border },
  ghostText: { color: AppTheme.textMuted },

  // --- SIZES ---
  smContainer: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 44 },
  smText: { fontSize: 14 }, // text-sm
  
  mdContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  mdText: { fontSize: 16 }, // text-base
  
  lgContainer: {
    width: '100%',
    minHeight: 56,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  lgText: {
    fontSize: 20,
    fontWeight: 'bold', // CORRIGIDO: string '700' trocada por 'bold' nativo
  },
});
