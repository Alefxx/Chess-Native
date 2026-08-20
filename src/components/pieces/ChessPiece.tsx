// src/components/pieces/ChessPiece.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// O dicionário agora usa o require() para importar os arquivos físicos.
// Assumindo que este arquivo está em src/components/pieces/
// e as imagens estão em src/assets/pieces/
export const pieceImages: Record<string, any> = {
  'bP': require('../../assets/pieces/bP.svg'),
  'bR': require('../../assets/pieces/bR.svg'),
  'bN': require('../../assets/pieces/bN.svg'),
  'bB': require('../../assets/pieces/bB.svg'),
  'bQ': require('../../assets/pieces/bQ.svg'),
  'bK': require('../../assets/pieces/bK.svg'),
  'wP': require('../../assets/pieces/wP.svg'),
  'wR': require('../../assets/pieces/wR.svg'),
  'wN': require('../../assets/pieces/wN.svg'),
  'wB': require('../../assets/pieces/wB.svg'),
  'wQ': require('../../assets/pieces/wQ.svg'),
  'wK': require('../../assets/pieces/wK.svg')
};

interface ChessPieceProps {
  char: string;
}

export function ChessPiece({ char }: ChessPieceProps) {
  // Ponte lógica: Converte o caractere FEN ('p') para a chave da imagem ('bP')
  const isWhite = char === char.toUpperCase();
  const colorPrefix = isWhite ? 'w' : 'b';
  const typeUpper = char.toUpperCase();
  const imageKey = `${colorPrefix}${typeUpper}`;

  const imageSource = pieceImages[imageKey];

  if (!imageSource) return null;

  return (
    // pointerEvents="none" garante que os toques passem direto pela imagem 
    // e sejam registrados no "quadrado" do tabuleiro que está embaixo dela
    <View style={styles.container} pointerEvents="none">
      <Image 
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    // Efeito de sombra (drop-shadow) adaptado para mobile
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3, // Sombras no Android
  },
  image: {
    width: '85%',
    height: '85%',
  }
});