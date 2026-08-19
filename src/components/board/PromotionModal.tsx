// src/components/board/PromotionModal.tsx
import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
// Assumindo que pieceImages agora importa imagens nativamente via require()
import { pieceImages } from '../pieces/ChessPiece';

interface PromotionModalProps {
  cor: 'branca' | 'preta';
  onSelect: (peca: 'q' | 'r' | 'b' | 'n') => void; 
}

export function PromotionModal({ cor, onSelect }: PromotionModalProps) {
  const prefix = cor === 'branca' ? 'w' : 'b';
  
  // No mobile, imgs via require() podem ser tipadas genericamente como "any" ou "ImageSourcePropType"
  const options: { id: 'q' | 'r' | 'b' | 'n', img: any }[] = [
    { id: 'q', img: pieceImages[`${prefix}Q`] },
    { id: 'r', img: pieceImages[`${prefix}R`] },
    { id: 'b', img: pieceImages[`${prefix}B`] },
    { id: 'n', img: pieceImages[`${prefix}N`] },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        {options.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              styles.button,
              // Simula o hover:bg-slate-500 quando pressionado
              pressed && styles.buttonPressed 
            ]}
          >
            <Image 
              source={opt.img} 
              style={styles.pieceImage}
              resizeMode="contain" 
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // bg-black/60 (sem o blur por padrão)
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#1e293b', // bg-slate-800
    padding: 16, // p-4
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    borderColor: '#475569', // border-slate-600
    flexDirection: 'row', // flex padrão p/ lado
    gap: 8, // gap-2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    width: 72,  // Tamanho intermediário entre 16(64px) e 20(80px) para telas mobile
    height: 72,
    backgroundColor: '#334155', // bg-slate-700
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#64748b', // hover:bg-slate-500
  },
  pieceImage: {
    width: '80%', // w-4/5
    height: '80%', // h-4/5
  }
});

