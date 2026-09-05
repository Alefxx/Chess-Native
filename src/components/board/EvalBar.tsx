import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calcularAlturaBarraBranca, formatarTextoAvaliacao } from '@/features/stockfish/analysis/utils/evalBar.utils';

interface EvalBarProps {
  vantagemBrancas: number;
  isMate: boolean;
  isInvertida?: boolean;
}

export function EvalBar({ vantagemBrancas, isMate, isInvertida = false }: EvalBarProps) {
  const alturaBranca = calcularAlturaBarraBranca(vantagemBrancas, isMate);
  const textoAvaliacao = formatarTextoAvaliacao(vantagemBrancas, isMate);
  
  const brancasGanhando = vantagemBrancas > 0;
  
  // Cores dinâmicas
  const bgTop = isInvertida ? '#e2e8f0' : '#1e293b'; // slate-200 : slate-800
  const bgBottom = isInvertida ? '#1e293b' : '#e2e8f0'; // slate-800 : slate-200
  const preenchimentoBottom = isInvertida ? (100 - alturaBranca) : alturaBranca;

  return (
    <View style={[styles.container, { backgroundColor: bgTop }]}>
      {/* Container dinâmico (representa a cor de baixo) */}
      <View 
        style={[
          styles.fill, 
          { backgroundColor: bgBottom, height: `${preenchimentoBottom}%` }
        ]} 
      />

      {/* Texto da Avaliação (Absolute positioning) */}
      <View style={styles.textContainer}>
        <Text style={[
          styles.text, 
          brancasGanhando ? styles.textDark : styles.textLight
        ]}>
          {textoAvaliacao}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32, // w-8
    height: '100%',
    minHeight: 1,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    position: 'relative',
  },
  fill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    padding: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textDark: { color: '#1e293b' }, // slate-800
  textLight: { color: '#cbd5e1' }, // slate-300
});

