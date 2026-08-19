// src/features/match/view/MatchView.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';

import { useAuthStore } from '@/store/authStore';
// Os hooks de lógica pura continuam intactos!
import { useMatch } from '../hooks/useMatch'; 
import { useChessClock } from '@/features/time/hooks/useChessClock';

export function MatchView() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const currentUser = useAuthStore((state) => state.user);

  // No React Navigation, pegamos os dados enviados de "route.params" ao invés de "location.state"
  const partidaData = route.params?.partidaData;
  const botOponente = route.params?.botOponente;
  const isEvalBarEnabled = route.params?.isEvalBarEnabled || false;

  useEffect(() => {
    // Tratamento de segurança: se a tela for acessada sem dados, volta pro Dashboard
    if (!partidaData || !currentUser) {
      navigation.replace('Dashboard'); // Usamos replace para ele não poder "voltar" pra essa tela vazia
    }
  }, [partidaData, currentUser, navigation]);

  // Instanciamos as regras de negócio
  const matchState = useMatch(partidaData, currentUser, botOponente, isEvalBarEnabled);

  if (!partidaData || !currentUser) return null;

  // Lógica de estado derivada para controle de turnos
  const turnoAtualFEN = matchState.gameFen.split(' ')[1] || 'w'; 
  const isMinhaVez = (matchState.minhaCor === 'branca' && turnoAtualFEN === 'w') || (matchState.minhaCor === 'preta' && turnoAtualFEN === 'b');
  const isAdversarioVez = !isMinhaVez;
  const isFimDeJogo = !!matchState.gameOver;
  
  // Mapeamento de Relógios
  const tempoJogador = matchState.minhaCor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas;
  const tempoAdversario = matchState.minhaCor === 'branca' ? matchState.tempoPretas : matchState.tempoBrancas;

  const clockAdversario = useChessClock(tempoAdversario, isAdversarioVez, isFimDeJogo);
  const clockJogador = useChessClock(tempoJogador, isMinhaVez, isFimDeJogo);

  return (
    <SafeAreaView style={styles.safeArea}>
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

        {/* Bloco 2: Tabuleiro Central (Puxa as props perfeitamente do useMatch) */}
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

        {/* Bloco 4: Barra de Avaliação e Histórico (Preenchendo o resto da tela) */}
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

          {/* O MoveHistoryBoard vai usar o espaço restante (flex: 1) para permitir rolagem interna */}
          <MoveHistoryBoard 
            pgnHistory={matchState.moveHistory} 
            onProporEmpate={() => console.log('Empate solicitado')}
            onAbandonar={matchState.abandonarPartida} 
          />
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // bg-slate-950
  },
  container: {
    flex: 1,
    paddingHorizontal: 8, // px-2
    paddingVertical: 16, // py-4
    gap: 8, // Espaçamento base entre os blocos
  },
  playerWrapper: {
    zIndex: 10, // Garante que modais ou interações fiquem acima se necessário
  },
  boardWrapper: {
    width: '100%',
    alignItems: 'center',
    // Não usamos flex: 1 aqui porque o tabuleiro precisa manter a proporção exata de quadrado,
    // o MatchBoardArea (que refatoramos antes) já cuida de não ultrapassar a tela.
    zIndex: 20, 
  },
  footerWrapper: {
    flex: 1, // Preenche todo o espaço que sobrar na parte de baixo da tela
    gap: 8,
    marginTop: 8,
  },
  evalContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // bg-slate-900/50
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#1e293b', // border-slate-800
    padding: 12, // p-4
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
  },
  openingBox: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // border-slate-700/50
    paddingBottom: 8, // pb-2
    alignItems: 'center',
  },
  openingText: {
    color: '#a8a29e', // text-stone-400
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-wider
    fontSize: 11, // text-[11px]
  },
  evalText: {
    color: '#64748b', // text-slate-500
    fontStyle: 'italic',
    fontSize: 12, // text-xs
    marginTop: 4, // pt-1
  }
});

