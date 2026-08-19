import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
// Atenção: Certifique-se de que este arquivo pieceImages no Mobile 
// esteja exportando as imagens usando require('caminho/da/imagem.png')
import { pieceImages } from '../pieces/ChessPiece';

interface CapturedPiecesProps {
  fen: string;
  capturedColor: 'white' | 'black'; 
}

export function CapturedPieces({ fen, capturedColor }: CapturedPiecesProps) {
  // --- A LÓGICA JAVASCRIPT CONTINUA EXATAMENTE IGUAL ---
  const initial = { q: 1, r: 2, b: 2, n: 2, p: 8 };
  const current: Record<string, number> = { q: 0, r: 0, b: 0, n: 0, p: 0 };
  const fenBoard = fen.split(' ')[0];
  
  for (let char of fenBoard) {
    const isWhitePiece = char === char.toUpperCase();
    
    if ((capturedColor === 'white' && isWhitePiece) || (capturedColor === 'black' && !isWhitePiece)) {
      const lower = char.toLowerCase();
      if (current[lower] !== undefined) {
        current[lower]++;
      }
    }
  }

  const captured: Record<string, number> = {
    q: Math.max(0, initial.q - current.q),
    r: Math.max(0, initial.r - current.r),
    b: Math.max(0, initial.b - current.b),
    n: Math.max(0, initial.n - current.n),
    p: Math.max(0, initial.p - current.p),
  };

  const piecesToRender: string[] = [];
  const order = ['q', 'r', 'b', 'n', 'p'];
  
  order.forEach(type => {
    for (let i = 0; i < captured[type]; i++) {
      piecesToRender.push(type);
    }
  });

  if (piecesToRender.length === 0) return null; 

  const prefix = capturedColor === 'white' ? 'w' : 'b';
  // ----------------------------------------------------

  return (
    <View style={styles.container}>
      {piecesToRender.map((type, idx) => (
        <Image 
          key={`${type}-${idx}`}
          // Na Web usávamos src, no Mobile usamos source
          source={pieceImages[`${prefix}${type.toUpperCase()}`]} 
          accessibilityLabel={`Captured ${type}`}
          // pointerEvents="none" substitui o draggable="false" e impede toques
          pointerEvents="none"
          // resizeMode substitui o object-contain
          resizeMode="contain"
          style={styles.pieceImage}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex flex-wrap items-center pt-1 ml-1 h-6
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 4,
    marginLeft: 4,
    height: 24,
  },
  pieceImage: {
    // w-6 h-6 (adotamos o tamanho sm padrão para mobile ficar mais visível)
    width: 24,
    height: 24,
    // -ml-1.5 (Garante aquele efeito legal das peças ficarem levemente sobrepostas)
    marginLeft: -6, 
    // drop-shadow-sm (Sombra leve para destacar peças brancas em fundo claro)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  }
});

