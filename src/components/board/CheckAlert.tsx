// src/components/board/CheckAlert.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Vibration, Animated } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface CheckAlertProps {
  isCheck: boolean;
}

export function CheckAlert({ isCheck }: CheckAlertProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCheck) {
      // 1. VIBRAÇÃO NATIVA
      // No React Native o padrão do array é: [esperar, vibrar, esperar, vibrar]
      const PATTERN = [0, 150, 80, 150]; 
      Vibration.vibrate(PATTERN);

      // 2. ANIMAÇÃO DE PULSAR
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true })
        ])
      ).start();
      
    } else {
      Vibration.cancel();
      pulseAnim.setValue(1);
    }
  }, [isCheck]);

  if (!isCheck) return null;

  return (
    // position: absolute, centralizado no topo
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <AlertTriangle size={18} color="#ffffff" />
      <Text style={styles.text}>XEQUE!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -24, // -top-6
    alignSelf: 'center', // left-1/2 -translate-x-1/2 da web vira isso no mobile!
    zIndex: 50,
    backgroundColor: '#dc2626', // bg-red-600
    paddingHorizontal: 16,      // px-4
    paddingVertical: 6,         // py-1.5
    borderRadius: 9999,         // rounded-full
    flexDirection: 'row',       // flex
    alignItems: 'center',       // items-center
    gap: 8,                     // gap-2
    borderWidth: 2,             // border-2
    borderColor: '#7f1d1d',     // border-red-900
    // shadow-[0_0_20px_rgba(220,38,38,0.8)]
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    color: '#ffffff', // text-white
    fontSize: 14,     // text-sm
    fontWeight: '900',// font-black
  }
});

