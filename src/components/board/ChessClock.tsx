// src/components/board/ChessClock.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

interface ChessClockProps {
  formato: string;
  isActive: boolean;
  isLowTime: boolean;
}

export function ChessClock({ formato, isActive, isLowTime }: ChessClockProps) {
  // Criamos um valor animado para a opacidade (começa em 1)
  const [opacityAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    if (isActive && isLowTime) {
      // Cria a animação de piscar (vai para 0.5 e volta para 1)
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      animation.start();
    } else {
      // Se não estiver com tempo baixo, cancela a animação e reseta para 1
      opacityAnim.stopAnimation();
      opacityAnim.setValue(1);
    }

    return () => animation?.stop();
  }, [isActive, isLowTime, opacityAnim]);

  if (formato === '∞') {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.textInfinity]}>∞</Text>
      </View>
    );
  }

  // Determina a cor do texto com base no estado
  let textColorClass = styles.textInactive;
  if (isActive) {
    textColorClass = isLowTime ? styles.textLowTime : styles.textActive;
  }

  return (
    <View style={[styles.container, isActive && !isLowTime && styles.glowActive]}>
      {/* Usamos Animated.Text para podermos aplicar a opacidade animada */}
      <Animated.Text style={[styles.text, textColorClass, { opacity: opacityAnim }]}>
        {formato}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a', // bg-slate-900
    paddingHorizontal: 16,      // px-4
    paddingVertical: 8,         // py-2
    borderRadius: 8,            // rounded-lg
    borderWidth: 1,             // border
    borderColor: '#1e293b',     // border-slate-800
    // No React Native, não existe "shadow-inner", mas a borda já cria um limite bom
  },
  glowActive: {
    // shadow-[0_0_10px_rgba(136,196,37,0.2)] adaptado para mobile
    shadowColor: '#88c425',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4, 
  },
  text: {
    fontFamily: 'monospace', // font-mono
    fontWeight: 'bold',      // font-bold
    fontSize: 20,            // text-xl
    textAlign: 'center',
  },
  textInfinity: {
    color: '#64748b', // text-slate-500
  },
  textActive: {
    color: '#88c425', // text-chess-green (assumi essa cor baseada na sombra)
  },
  textLowTime: {
    color: '#ef4444', // text-red-500
  },
  textInactive: {
    color: '#475569', // text-slate-600
  },
});

