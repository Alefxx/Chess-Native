// src/components/ui/ColorSelector.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Dices } from 'lucide-react-native'; // Não esqueça de importar a versão nativa

export type PlayerColor = 'white' | 'black' | 'random';

interface ColorSelectorProps {
  selected: PlayerColor;
  onSelect: (color: PlayerColor) => void;
  isMultiplayer?: boolean;
}

export function ColorSelector({ selected, onSelect, isMultiplayer = false }: ColorSelectorProps) {
  return (
    <View style={styles.container}>
      
      {/* Botão BRANCAS */}
      <Pressable
        onPress={() => onSelect('white')}
        accessibilityRole="button"
        accessibilityLabel="Jogar com as peças brancas"
        accessibilityState={{ selected: selected === 'white' }}
        style={({ pressed }) => [
          styles.buttonBase,
          selected === 'white' ? styles.selectedWhite : styles.unselected,
          pressed && styles.pressed
        ]}
      >
        <View style={styles.whiteCircle} />
      </Pressable>

      {/* Botão ALEATÓRIO */}
      <Pressable
        onPress={() => !isMultiplayer && onSelect('random')}
        disabled={isMultiplayer}
        accessibilityRole="button"
        accessibilityLabel="Sortear a cor"
        accessibilityState={{ selected: selected === 'random', disabled: isMultiplayer }}
        style={({ pressed }) => [
          styles.buttonBase,
          isMultiplayer ? styles.disabled : (selected === 'random' ? styles.selectedRandom : styles.unselected),
          pressed && !isMultiplayer && styles.pressed
        ]}
      >
        <Dices size={32} color={selected === 'random' ? '#3b82f6' : '#64748b'} />
      </Pressable>

      {/* Botão PRETAS */}
      <Pressable
        onPress={() => onSelect('black')}
        accessibilityRole="button"
        accessibilityLabel="Jogar com as peças pretas"
        accessibilityState={{ selected: selected === 'black' }}
        style={({ pressed }) => [
          styles.buttonBase,
          selected === 'black' ? styles.selectedBlack : styles.unselected,
          pressed && styles.pressed
        ]}
      >
        <View style={styles.blackCircle} />
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16, // gap-4
    justifyContent: 'center',
    width: '100%',
    maxWidth: 384, // max-w-sm
    alignSelf: 'center', // mx-auto
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-md
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.95 }], // active:scale-95
  },
  unselected: {
    borderColor: '#334155', // border-slate-700
    backgroundColor: '#0f172a', // bg-slate-900
  },
  selectedWhite: {
    borderColor: '#88c425', // border-chess-green
    backgroundColor: '#1e293b', // bg-slate-800
  },
  selectedBlack: {
    borderColor: '#88c425', 
    backgroundColor: '#1e293b',
  },
  selectedRandom: {
    borderColor: '#3b82f6', // border-analysis-blue
    backgroundColor: '#1e293b',
  },
  disabled: {
    opacity: 0.3,
    borderColor: '#1e293b', // border-slate-800
    backgroundColor: '#0f172a',
  },
  whiteCircle: {
    width: 32, // w-8
    height: 32, // h-8
    borderRadius: 16, // rounded-full
    backgroundColor: '#f1f5f9', // bg-slate-100
    borderWidth: 1,
    borderColor: '#cbd5e1', // border-slate-300
    // O RN não suporta 'inset' box-shadow diretamente, mas isso dá um efeito similar de profundidade
    elevation: 1,
  },
  blackCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0f172a', // bg-slate-900
    borderWidth: 1,
    borderColor: '#020617', // border-slate-950
    elevation: 1,
  }
});

