// src/components/analysis/MoveQualityIcon.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
// Note que mudamos de 'lucide-react' para 'lucide-react-native'
import { BookOpen, ArrowRight } from 'lucide-react-native';

export type MoveQuality = 'book' | 'best' | 'great' | 'inaccuracy' | 'mistake' | 'blunder';

interface MoveQualityIconProps {
  quality: MoveQuality;
  // Na Web usávamos 'className' (string), aqui usamos o tipo StyleProp
  style?: StyleProp<ViewStyle>;
}

export function MoveQualityIcon({ quality, style }: MoveQualityIconProps) {
  // Configurações padrão de tamanho e traço para todos os ícones
  const iconSize = 20; // Aproximadamente w-5 h-5 (5 * 4px = 20px)
  const iconStrokeWidth = 3;

  // Tratamento especial para Lances de Livro (Teoria)
  if (quality === 'book') {
    return (
      // 1. Substituímos <div> por <View>
      // 2. Combinamos o estilo padrão do container (styles.container)
      //    com o estilo específico de cor (styles.bookContainer)
      //    e qualquer estilo extra passado via props (style).
      <View style={[styles.container, styles.bookContainer, style]}>
        <BookOpen 
          size={iconSize} 
          strokeWidth={iconStrokeWidth}
          // A cor do ícone é passada via prop 'color', não via classe de texto
          color="#a8a29e" // text-stone-400
        />
      </View>
    );
  }

  // Mapeamento das qualidades padrão
  // Na web usávamos rotação via classe de transformação.
  // No nativo, aplicamos a rotação no container <View> que envolve o ícone.
  const styleMap: Record<Exclude<MoveQuality, 'book'>, { color: string; rotation: string }> = {
    best: { color: '#eab308', rotation: '-90deg' },       // text-yellow-500, Cima
    great: { color: '#3b82f6', rotation: '-45deg' },      // text-blue-500, Diagonal Cima
    inaccuracy: { color: '#22c55e', rotation: '0deg' },   // text-green-500, Meio (Direita)
    mistake: { color: '#f97316', rotation: '45deg' },     // text-orange-500, Diagonal Baixo
    blunder: { color: '#ef4444', rotation: '90deg' }      // text-red-500, Baixo
  };

  const { color, rotation } = styleMap[quality];

  return (
    // Aplicamos a rotação na View que envolve o ícone
    <View style={[styles.container, style, { transform: [{ rotate: rotation }] }]}>
      {/* 
        Substituímos o SVG cru pelo ícone ArrowRight do lucide-react-native.
        O SVG original era apenas uma seta para a direita que era rotacionada.
      */}
      <ArrowRight 
        size={iconSize} 
        strokeWidth={iconStrokeWidth} 
        color={color} 
      />
    </View>
  );
}

// Criamos o StyleSheet no final do arquivo (estilo padrão do React Native)
const styles = StyleSheet.create({
  container: {
    // flex items-center justify-center
    flexDirection: 'row', // No nativo flex é padrão, definimos a direção
    alignItems: 'center',
    justifyContent: 'center',
    // p-1
    padding: 4,
    // rounded-full
    borderRadius: 9999, // Um número grande garante que fique redondo
    // bg-slate-800/50 (rgba aproximado)
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  bookContainer: {
    // Estilo específico apenas para o 'book'
    // (na web era text-stone-400, mas isso afeta o ícone, não o container,
    // então a View não precisa de estilo extra aqui)
  },
});

