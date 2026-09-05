// src/components/pieces/ChessPiece.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // 👈 Importa do expo-image, NÃO do react-native!

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

export const ChessPiece = React.memo(function ChessPiece({ char }: ChessPieceProps) {
  const isWhite = char === char.toUpperCase();
  const colorPrefix = isWhite ? 'w' : 'b';
  const typeUpper = char.toUpperCase();
  const imageKey = `${colorPrefix}${typeUpper}`;

  const imageSource = pieceImages[imageKey];

  if (!imageSource) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Image 
        source={imageSource}
        style={styles.image}
        contentFit="contain" // 👈 No expo-image usa contentFit em vez de resizeMode
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: '85%',
    height: '85%',
  }
});

