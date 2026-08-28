// src/components/ui/Card.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface CardProps {
  children: ReactNode; 
  style?: StyleProp<ViewStyle>; // Bônus: permitindo passar estilos extras se necessário
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center', // mx-auto
    padding: 20, // p-5 (médio p-5 e md:p-8)
    backgroundColor: '#1e293b', // bg-slate-800
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    // shadow-2xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  }
});

