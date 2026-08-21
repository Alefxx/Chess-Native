// src/components/board/PromotionModal.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Correção vital para ler os SVGs!
import { pieceImages } from '../pieces/ChessPiece';

interface PromotionModalProps {
  cor: 'branca' | 'preta';
  onSelect: (peca: 'q' | 'r' | 'b' | 'n') => void; 
}

export function PromotionModal({ cor, onSelect }: PromotionModalProps) {
  const prefix = cor === 'branca' ? 'w' : 'b';
  
  const options: { id: 'q' | 'r' | 'b' | 'n', img: any }[] = [
    { id: 'q', img: pieceImages[`${prefix}Q`] },
    { id: 'r', img: pieceImages[`${prefix}R`] },
    { id: 'b', img: pieceImages[`${prefix}B`] },
    { id: 'n', img: pieceImages[`${prefix}N`] },
  ];

  return (
    // Z-Index altíssimo para furar qualquer restrição do tabuleiro
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        {options.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed 
            ]}
          >
            <Image 
              source={opt.img} 
              style={styles.pieceImage}
              contentFit="contain" // A Expo usa contentFit em vez de resizeMode
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    // Isso garante que ele cubra tudo, contanto que o "pai" não tenha overflow: hidden
    ...StyleSheet.absoluteFillObject,
    zIndex: 999, // Elevado para garantir a sobreposição
    elevation: 99, // Elevação alta para o Android
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Um pouco mais escuro para focar nas peças
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#1e293b', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 2,
    borderColor: '#475569', 
    flexDirection: 'row', 
    gap: 12, // Aumentei um pouco o gap para os dedos não esbarrarem
    // Sombras do Box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    width: 64,  // Reduzido levemente para caber melhor em telas estreitas
    height: 64,
    backgroundColor: '#334155', 
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#64748b', 
    transform: [{ scale: 0.95 }], // Dá um feedback tátil de clique
  },
  pieceImage: {
    width: '80%', 
    height: '80%', 
  }
});
