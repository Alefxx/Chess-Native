// src/features/match/view/MatchView.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do Layout

import { useAuthStore } from '@/store/authStore';
import { useMatch } from '../hooks/useMatch'; 
import { useChessClock } from '@/features/time/hooks/useChessClock';

export function MatchView() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const currentUser = useAuthStore((state) => state.user);

  const partidaData = route.params?.partidaData;
  const botOponente = route.params?.botOponente;
  const isEvalBarEnabled = route.params?.isEvalBarEnabled || false;

  useEffect(() => {
    if (!partidaData || !currentUser) {
      navigation.replace('Dashboard');
    }
  }, [partidaData, currentUser, navigation]);

  const matchState = useMatch(partidaData, currentUser, botOponente, isEvalBarEnabled);

  if (!partidaData || !currentUser) return null;

  const turnoAtualFEN = matchState.gameFen.split(' ')[1] || 'w'; 
  const isMinhaVez = (matchState.minhaCor === 'branca' && turnoAtualFEN === 'w') || (matchState.minhaCor === 'preta' && turnoAtualFEN === 'b');
  const isAdversarioVez = !isMinhaVez;
  const isFimDeJogo = !!matchState.gameOver;
  
  const tempoJogador = matchState.minhaCor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas;
  const tempoAdversario = matchState.minhaCor === 'branca' ? matchState.tempoPretas : matchState.tempoBrancas;

  const clockAdversario = useChessClock(tempoAdversario, isAdversarioVez, isFimDeJogo);
  const clockJogador = useChessClock(tempoJogador, isMinhaVez, isFimDeJogo);

  return (
    // Substituindo o SafeAreaView pelo nosso ScreenLayout com noPadding
    <ScreenLayout noPadding>
      <View style={styles.container}>
        
        {/* Bloco 1: Adversário no Topo */}
        <View style={styles.playerWrapper}>
          <PlayerPanel 
            nome={partidaData.jogadores.pretas}
            rating={botOponente?.rating || 1500}
            iniciais="OP"
            foto={botOponente?.foto}
            clockFormat={clockAdversario.formato}
            isClockActive={isAdversarioVez}
            isLowTime={clockAdversario.isLowTime}
            fen={matchState.gameFen}
            capturedColor={matchState.minhaCor === 'branca' ? 'white' : 'black'}
            position="top"
          />
        </View>

        {/* Bloco 2: Tabuleiro Central */}
        <View style={styles.boardWrapper}>
          <MatchBoardArea 
            isEvalBarEnabled={isEvalBarEnabled}
            minhaCor={matchState.minhaCor as 'branca' | 'preta'}
            gameFen={matchState.gameFen}
            isCheck={matchState.isCheck}
            lastMove={matchState.lastMove}
            moveSquares={matchState.moveSquares}
            onSquareClick={matchState.onSquareClick}
            realizarMovimento={matchState.realizarMovimento}
            pendingPromotion={matchState.pendingPromotion}
            setPendingPromotion={matchState.setPendingPromotion}
            vantagemBrancas={matchState.vantagemBrancas}
            isMate={matchState.isMate}
            gameOver={matchState.gameOver}
            progressoFila={matchState.progressoFila}
            minhasEstatisticas={matchState.minhasEstatisticas}
            iniciarAvaliacaoFimDeJogo={matchState.iniciarAvaliacaoFimDeJogo}
            pararAvaliacao={matchState.pararAvaliacao}
            partidaData={partidaData}
            botOponente={botOponente}
            moveHistory={matchState.moveHistory}
            avaliacoesLocais={matchState.avaliacoesLocais}
            fenHistory={matchState.fenHistory}
            moveCoordsHistory={matchState.moveCoordsHistory}
          />
        </View>

        {/* Bloco 3: Usuário Logado na Base */}
        <View style={styles.playerWrapper}>
          <PlayerPanel 
            nome={currentUser.nome}
            rating={currentUser.rating}
            iniciais={currentUser.nome.substring(0,2).toUpperCase()}
            clockFormat={clockJogador.formato}
            isClockActive={isMinhaVez}
            isLowTime={clockJogador.isLowTime}
            fen={matchState.gameFen}
            capturedColor={matchState.minhaCor === 'branca' ? 'black' : 'white'}
            position="bottom"
          />
        </View>

        {/* Bloco 4: Barra de Avaliação e Histórico */}
        <View style={styles.footerWrapper}>
          
          {isEvalBarEnabled && (
            <View style={styles.evalContainer}>
              {matchState.currentOpening && (
                <View style={styles.openingBox}>
                  <Text style={styles.openingText}>
                    {matchState.currentOpening.name}
                  </Text>
                </View>
              )}
              
              <Text style={styles.evalText}>
                {matchState.isMate 
                  ? `Motor: Xeque-Mate em ${Math.abs(matchState.vantagemBrancas)}`
                  : `Avaliação do motor: ${matchState.vantagemBrancas > 0 ? '+' : ''}${matchState.vantagemBrancas.toFixed(1)}`}
              </Text>
            </View>
          )}

          <MoveHistoryBoard 
            pgnHistory={matchState.moveHistory} 
            onProporEmpate={() => console.log('Empate solicitado')}
            onAbandonar={matchState.abandonarPartida} 
          />
        </View>
        
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Removi o safeArea daqui, o layout já cuida disso
  container: {
    flex: 1,
    paddingHorizontal: 8, 
    paddingVertical: 16, 
    gap: 8, 
  },
  playerWrapper: {
    zIndex: 10, 
  },
  boardWrapper: {
    width: '100%',
    alignItems: 'center',
    zIndex: 20, 
  },
  footerWrapper: {
    flex: 1, 
    gap: 8,
    marginTop: 8,
  },
  evalContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)', 
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#1e293b', 
    padding: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, 
  },
  openingBox: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', 
    paddingBottom: 8, 
    alignItems: 'center',
  },
  openingText: {
    color: '#a8a29e', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1, 
    fontSize: 11, 
  },
  evalText: {
    color: '#64748b', 
    fontStyle: 'italic',
    fontSize: 12, 
    marginTop: 4, 
  }
});
