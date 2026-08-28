// src/components/board/PromotionModal.tsx
import React from 'react';
import { View, Pressable, StyleSheet, Modal, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image'; // Correção vital para ler os SVGs!
import { pieceImages } from '../pieces/ChessPiece';

interface PromotionModalProps {
  cor: 'branca' | 'preta';
  onSelect: (peca: 'q' | 'r' | 'b' | 'n') => void; 
  disabled?: boolean;
}

export function PromotionModal({ cor, onSelect, disabled = false }: PromotionModalProps) {
  const prefix = cor === 'branca' ? 'w' : 'b';
  
  const options: { id: 'q' | 'r' | 'b' | 'n', img: any }[] = [
    { id: 'q', img: pieceImages[`${prefix}Q`] },
    { id: 'r', img: pieceImages[`${prefix}R`] },
    { id: 'b', img: pieceImages[`${prefix}B`] },
    { id: 'n', img: pieceImages[`${prefix}N`] },
  ];

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.modalBox} accessibilityViewIsModal>
          <Text style={styles.title}>Promover peão</Text>
          <Text style={styles.subtitle}>Escolha a nova peça</Text>
          <View style={styles.options}>
        {options.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Promover para ${{ q: 'dama', r: 'torre', b: 'bispo', n: 'cavalo' }[opt.id]}`}
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
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    // Isso garante que ele cubra tudo, contanto que o "pai" não tenha overflow: hidden
    flex: 1,
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
    width: '92%',
    maxWidth: 360,
    alignItems: 'center',
    // Sombras do Box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginTop: 4, marginBottom: 16 },
  options: { flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center' },
  button: {
    flex: 1,
    maxWidth: 72,
    aspectRatio: 1,
    minHeight: 56,
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
