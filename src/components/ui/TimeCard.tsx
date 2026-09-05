// src/components/timeselection/TimeCard.tsx
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeCardProps {
  time: TimeOption;
  isSelected: boolean;
  onPress: () => void; // onClick vira onPress
}

export function TimeCard({ time, isSelected, onPress }: TimeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Controle de tempo ${time.label}`}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.base,
        isSelected ? styles.selected : styles.unselected,
        pressed && styles.pressed
      ]}
    >
      <Text style={[
        styles.text, 
        isSelected ? styles.textSelected : styles.textUnselected
      ]}>
        {time.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12, // py-3
    paddingHorizontal: 8, // px-2
    borderRadius: 8, // rounded-lg
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }], // active:scale-95
  },
  unselected: {
    backgroundColor: '#1e293b', // bg-slate-800
    borderColor: '#334155', // border-slate-700
  },
  selected: {
    backgroundColor: '#38bdf8', // bg-analysis-blue (Sky Blue do Tailwind)
    borderColor: '#38bdf8',
    // shadow-[0_0_10px_rgba(56,189,248,0.4)]
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    fontWeight: 'bold',
  },
  textUnselected: {
    color: '#cbd5e1', // text-slate-300
  },
  textSelected: {
    color: '#0f172a', // text-slate-900
  }
});

