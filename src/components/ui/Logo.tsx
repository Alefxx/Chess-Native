// src/components/ui/Logo.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ size = 'md' }: LogoProps) {
  // Animação de opacidade para o "animate-pulse"
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { 
          toValue: 1, 
          duration: 800, 
          useNativeDriver: true // <- O segredo da alta performance em arquitetura mobile
        }),
        Animated.timing(pulseAnim, { 
          toValue: 0.4, 
          duration: 800, 
          useNativeDriver: true 
        })
      ])
    ).start();
  }, []);

  // Mapeamento dinâmico de tamanhos substituindo as classes do Tailwind
  const sizeMap = {
    sm: { fontSize: 18, dotSize: 6, margin: 4 }, // text-lg
    md: { fontSize: 24, dotSize: 6, margin: 6 }, // text-2xl
    lg: { fontSize: 36, dotSize: 8, margin: 8 }, // text-4xl
    xl: { fontSize: 60, dotSize: 12, margin: 12 },// text-6xl
  };

  const currentSize = sizeMap[size];

  return (
    <View style={styles.container}>
      {/* CHESS (Verde Lima) */}
      <Text style={[styles.text, { fontSize: currentSize.fontSize, color: '#88c425' }]}>
        CHESS
      </Text>
      
      {/* ANALYSIS (Sky Blue) */}
      <Text style={[styles.text, { fontSize: currentSize.fontSize, color: '#38bdf8', marginLeft: 4 }]}>
        ANALYSIS
      </Text>
      
      {/* Ponto Pulsante */}
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: currentSize.dotSize, 
            height: currentSize.dotSize, 
            opacity: pulseAnim,
            marginLeft: currentSize.margin,
            // Um leve ajuste para alinhar com a base do texto dependendo do tamanho
            marginTop: size === 'xl' ? 16 : 8 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '900', // font-black
    letterSpacing: -1, // tracking-tighter
  },
  dot: {
    backgroundColor: '#38bdf8', // bg-analysis-blue
    borderRadius: 9999, // rounded-full
  }
});

