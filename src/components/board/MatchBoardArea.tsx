// src/components/board/MatchBoardArea.tsx
import React, { useMemo } from 'react';
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
  boardOrientation?: 'white' | 'black';
  boardSize: number;
  
  gameFen: string;
  isCheck: boolean;
  lastMove: { origem: string; destino: string } | null;
  moveSquares: Record<string, ViewStyle>; 
  
  onSquareClick: (square: string) => void;
  realizarMovimento: (origem: string, destino: string, peca?: string) => void;
  
  pendingPromotion: { origem: string; destino: string } | null;
  
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
  isMovePending?: boolean;
}

export function MatchBoardArea({
  isEvalBarEnabled,
  minhaCor,
  boardOrientation,
  boardSize,
  gameFen,
  isCheck,
  lastMove,
  moveSquares,
  onSquareClick,
  realizarMovimento,
  pendingPromotion,
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
  moveCoordsHistory,
  isMovePending = false
}: MatchBoardAreaProps) {
  
  const navigation = useNavigation<any>();

  // A função de merge de estilos mescla as casas válidas com a casa do último lance
  const combinedStyles = useMemo(() => {
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
  }, [lastMove, moveSquares]);

  return (
    <View style={styles.container}>
      
      {/* Barra de Avaliação */}
      {isEvalBarEnabled && (
        <View style={[styles.evalBarWrapper, { height: boardSize }]}>
          <EvalBar 
            vantagemBrancas={vantagemBrancas} 
            isMate={isMate} 
            isInvertida={minhaCor === 'preta'} 
          />
        </View>
      )}

      {/* Wrapper do Tabuleiro */}
      <View style={[styles.boardWrapper, { width: boardSize, height: boardSize }]}>
        <CheckAlert isCheck={isCheck} />

        <CustomChessboard 
          fen={gameFen} 
          boardOrientation={boardOrientation || (minhaCor === 'branca' ? 'white' : 'black')}
          onSquareClick={onSquareClick}
          customSquareStyles={combinedStyles}
          disabled={isMovePending || !!gameOver || !!pendingPromotion}
        />

        {/* Modal de Promoção preso na área do tabuleiro */}
        {pendingPromotion && (
          <PromotionModal 
            cor={minhaCor}
            disabled={isMovePending}
            onSelect={(peca) => {
              realizarMovimento(pendingPromotion.origem, pendingPromotion.destino, peca);
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
            onPlayAgain={() => {
              pararAvaliacao();
              const isLocal = partidaData?.tipoPartida === 'local';
              navigation.reset({
                index: 1,
                routes: [
                  { name: 'Dashboard' },
                  {
                    name: 'Time',
                    params: isLocal
                      ? { tipoPartida: 'local', guestName: partidaData?.jogadores?.pretas || 'Visitante' }
                      : { bot: botOponente }
                  }
                ]
              });
            }}
            onClose={() => {
              pararAvaliacao();
              navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
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
    maxWidth: 720,
    alignSelf: 'center', 
    marginTop: 8,
    flexDirection: 'row', 
    gap: 8, 
    alignItems: 'stretch', 
    justifyContent: 'center',
  },
  evalBarWrapper: {
    flexShrink: 0,
  },
  boardWrapper: {
    flexShrink: 0,
    justifyContent: 'center',
  }
});
