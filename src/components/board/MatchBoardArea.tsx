// src/components/board/MatchBoardArea.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { GameOverModal } from '@/components/board/GameOverModal';
import { PromotionModal } from '@/components/board/PromotionModal';
import { CheckAlert } from '@/components/board/CheckAlert';
import { EvalBar } from '@/components/board/EvalBar';

interface MatchBoardAreaProps {
  isEvalBarEnabled: boolean;
  minhaCor: 'branca' | 'preta';
  
  gameFen: string;
  isCheck: boolean;
  lastMove: { origem: string; destino: string } | null;
  moveSquares: Record<string, ViewStyle>; 
  
  onSquareClick: (square: string) => void;
  realizarMovimento: (origem: string, destino: string, peca?: string) => void;
  
  pendingPromotion: { origem: string; destino: string } | null;
  setPendingPromotion: (prom: { origem: string; destino: string } | null) => void;
  
  vantagemBrancas: number;
  isMate: boolean;
  
  gameOver: any;
  progressoFila: any;
  minhasEstatisticas: any;
  iniciarAvaliacaoFimDeJogo: () => void;
  pararAvaliacao: () => void;
  
  partidaData: any;
  botOponente: any;
  moveHistory: any;
  avaliacoesLocais: any;
  fenHistory: any;
  moveCoordsHistory: any;
}

export function MatchBoardArea({
  isEvalBarEnabled,
  minhaCor,
  gameFen,
  isCheck,
  lastMove,
  moveSquares,
  onSquareClick,
  realizarMovimento,
  pendingPromotion,
  setPendingPromotion,
  vantagemBrancas,
  isMate,
  gameOver,
  progressoFila,
  minhasEstatisticas,
  iniciarAvaliacaoFimDeJogo,
  pararAvaliacao,
  partidaData,
  botOponente,
  moveHistory,
  avaliacoesLocais,
  fenHistory,
  moveCoordsHistory
}: MatchBoardAreaProps) {
  
  const navigation = useNavigation<any>();

  // A função de merge de estilos mescla as casas válidas com a casa do último lance
  const getCombinedStyles = () => {
    const styles: Record<string, ViewStyle> = { ...moveSquares }; 

    if (lastMove) {
      styles[lastMove.origem] = { 
        ...styles[lastMove.origem], 
        backgroundColor: 'rgba(255, 255, 0, 0.4)' 
      };
      styles[lastMove.destino] = { 
        ...styles[lastMove.destino], 
        backgroundColor: 'rgba(255, 255, 0, 0.4)' 
      };
    }

    return styles;
  };

  return (
    <View style={styles.container}>
      
      {/* Barra de Avaliação */}
      {isEvalBarEnabled && (
        <View style={styles.evalBarWrapper}>
          <EvalBar 
            vantagemBrancas={vantagemBrancas} 
            isMate={isMate} 
            isInvertida={minhaCor === 'preta'} 
          />
        </View>
      )}

      {/* Wrapper do Tabuleiro */}
      <View style={styles.boardWrapper}>
        <CheckAlert isCheck={isCheck} />

        <CustomChessboard 
          fen={gameFen} 
          boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
          onSquareClick={onSquareClick}
          customSquareStyles={getCombinedStyles()}
        />

        {/* Modal de Promoção preso na área do tabuleiro */}
        {pendingPromotion && (
          <PromotionModal 
            cor={minhaCor}
            onSelect={(peca) => {
              realizarMovimento(pendingPromotion.origem, pendingPromotion.destino, peca);
              setPendingPromotion(null);
            }} 
          />
        )}

        {/* Modal de Fim de Jogo (Fura o bloqueio da tela usando Modal Nativo) */}
        {gameOver && (
          <GameOverModal 
            vencedor={gameOver.vencedor}
            motivo={gameOver.motivo} 
            minhaCor={minhaCor}
            progressoFila={progressoFila}
            stats={minhasEstatisticas}
            onAvaliar={() => iniciarAvaliacaoFimDeJogo()}
            onVerNoTabuleiro={() => {
              navigation.navigate('Analysis', { 
                partidaData,
                botOponente,
                minhaCor,
                moveHistory,
                avaliacoesLocais,
                fenHistory,
                moveCoordsHistory
              });
            }}
            onClose={() => {
              pararAvaliacao();
              navigation.navigate('Dashboard'); 
            }} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center', 
    marginTop: 16, 
    flexDirection: 'row', 
    gap: 8, 
    alignItems: 'stretch', 
  },
  evalBarWrapper: {
    flexShrink: 0,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center', // Centraliza o tabuleiro verticalmente no espaço livre
  }
});
