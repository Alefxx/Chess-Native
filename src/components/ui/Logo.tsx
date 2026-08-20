// src/components/ui/Logo.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ size = 'md' }: LogoProps) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const sizeMap = {
    sm: {
      fontSize: 16,
      dotSize: 5,
      margin: 4,
    },
    md: {
      fontSize: 22,
      dotSize: 6,
      margin: 5,
    },
    lg: {
      fontSize: 32,
      dotSize: 8,
      margin: 7,
    },
    xl: {
      fontSize: 50,
      dotSize: 10,
      margin: 10,
    },
  };

  const currentSize = sizeMap[size];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
            color: '#88c425',
          },
        ]}
      >
        CHESS
      </Text>

      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
            color: '#38bdf8',
            marginLeft: currentSize.margin,
          },
        ]}
      >
        ANALYSIS
      </Text>

      <Animated.View
        style={[
          styles.dot,
          {
            width: currentSize.dotSize,
            height: currentSize.dotSize,
            opacity: pulseAnim,
            marginLeft: currentSize.margin,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  text: {
    fontWeight: 'bold', // CORRIGIDO: string '900' trocada por 'bold' nativo
    letterSpacing: -1,
  },
  dot: {
    backgroundColor: '#38bdf8',
    borderRadius: 999,
  },
});
