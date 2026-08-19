import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ChessPiece } from '../pieces/ChessPiece'; 

interface CustomChessboardProps {
  fen: string;
  boardOrientation: 'white' | 'black';
  onSquareClick: (square: string) => void;
  customSquareStyles?: Record<string, ViewStyle>; // Adaptado para React Native
}

export function CustomChessboard({ 
  fen, 
  boardOrientation, 
  onSquareClick, 
  customSquareStyles = {} 
}: CustomChessboardProps) {
  
  // Lógica de FEN idêntica
  const boardMap: Record<string, string> = {};
  const fenPosition = fen.split(' ')[0];
  const fenRows = fenPosition.split('/');
  const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  fenRows.forEach((rowString, rIndex) => {
    const rowNumber = 8 - rIndex;
    let colIndex = 0;
    for (let char of rowString) {
      if (!isNaN(parseInt(char))) colIndex += parseInt(char);
      else {
        boardMap[`${colNames[colIndex]}${rowNumber}`] = char;
        colIndex++;
      }
    }
  });

  const displayRows = boardOrientation === 'white' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const displayCols = boardOrientation === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  
  return (
    <View style={styles.board}>
      {displayRows.map((row) => 
        displayCols.map((col) => {
          const square = `${col}${row}`;
          const pieceChar = boardMap[square];
          const isDark = (colNames.indexOf(col) + (8 - row)) % 2 !== 0;
          
          return (
            <Pressable 
              key={square}
              onPress={() => onSquareClick(square)}
              style={[
                styles.square,
                { backgroundColor: isDark ? '#475569' : '#cbd5e1' },
                customSquareStyles[square] || {}
              ]}
            >
              {pieceChar && <ChessPiece char={pieceChar} />}
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1, // Mantém quadrado automaticamente
    flexDirection: 'row',
    flexWrap: 'wrap', // O substituto do Grid
    borderWidth: 4,
    borderColor: '#1e293b',
    borderRadius: 2,
    overflow: 'hidden',
  },
  square: {
    width: '12.5%', // 100% / 8 colunas = 12.5% por quadrado
    height: '12.5%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

