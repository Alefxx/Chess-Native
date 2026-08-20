// src/features/match/view/GameLocalView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Componentes da Nova Arquitetura Limpa
import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do Layout

// Hooks e Stores
import { useAuthStore } from '@/store/authStore'; 
import { useMatch } from '@/features/match/hooks/useMatch';
import { useChessClock } from '@/features/time/hooks/useChessClock';

export function GameLocal() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const currentUser = useAuthStore((state) => state.user);
  
  const partidaData = route.params?.partidaData;
  const isEvalBarEnabled = route.params?.isEvalBarEnabled || false;

  useEffect(() => {
    if (!partidaData || partidaData.tipoPartida !== 'local') {
      navigation.replace('Dashboard');
    }
  }, [partidaData, navigation]);

  const matchState = useMatch(partidaData, currentUser, undefined, isEvalBarEnabled);

  const [autoFlip, setAutoFlip] = useState(true);

  const rotateAnim = useRef(new Animated.Value(autoFlip ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: autoFlip ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [autoFlip]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  if (!partidaData || !currentUser) return null;

  const boardOrientation = autoFlip ? (matchState.minhaCor === 'branca' ? 'white' : 'black') : 'white'; 
  const bottomColor = boardOrientation === 'white' ? 'branca' : 'preta';
  const topColor = boardOrientation === 'white' ? 'preta' : 'branca';

  const bottomPlayerName = bottomColor === 'branca' ? partidaData.jogadores.brancas : partidaData.jogadores.pretas;
  const topPlayerName = topColor === 'branca' ? partidaData.jogadores.brancas : partidaData.jogadores.pretas;

  const isBottomTurn = matchState.minhaCor === bottomColor;
  const isTopTurn = matchState.minhaCor === topColor;
  const isFimDeJogo = !!matchState.gameOver;

  const clockBottom = useChessClock(bottomColor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas, isBottomTurn, isFimDeJogo);
  const clockTop = useChessClock(topColor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas, isTopTurn, isFimDeJogo);

  return (
    // Substituímos o SafeAreaView pelo ScreenLayout com noPadding
    <ScreenLayout noPadding>
      <View style={styles.container}>
        <View style={styles.content}>
          
          {/* HUD Superior (Animado com rotação) */}
          <Animated.View 
            style={[
              styles.hudWrapper,
              isTopTurn ? styles.activeBorder : styles.inactiveBorder,
              { transform: [{ rotate: rotateInterpolate }] } 
            ]}
          >
            <PlayerPanel 
              nome={topPlayerName}
              rating={1500}
              iniciais={topPlayerName.substring(0,2).toUpperCase()}
              clockFormat={clockTop.formato}
              isClockActive={isTopTurn}
              isLowTime={clockTop.isLowTime}
              fen={matchState.gameFen}
              capturedColor={topColor === 'branca' ? 'white' : 'black'}
              position="top"
            />
          </Animated.View>

          {/* Área Central: Tabuleiro */}
          <View style={styles.boardWrapper}>
            <MatchBoardArea 
              isEvalBarEnabled={isEvalBarEnabled}
              minhaCor={bottomColor} 
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
              botOponente={undefined}
              moveHistory={matchState.moveHistory}
              avaliacoesLocais={matchState.avaliacoesLocais}
              fenHistory={matchState.fenHistory}
              moveCoordsHistory={matchState.moveCoordsHistory}
            />
          </View>

          {/* HUD Inferior */}
          <View style={[
            styles.hudWrapper,
            isBottomTurn ? styles.activeBorder : styles.inactiveBorder
          ]}>
            <PlayerPanel 
              nome={bottomPlayerName}
              rating={1500}
              iniciais={bottomPlayerName.substring(0,2).toUpperCase()}
              clockFormat={clockBottom.formato}
              isClockActive={isBottomTurn}
              isLowTime={clockBottom.isLowTime}
              fen={matchState.gameFen}
              capturedColor={bottomColor === 'branca' ? 'black' : 'white'}
              position="bottom"
            />
          </View>

          {/* Botão de Controle do Giro Automático */}
          <Pressable 
            onPress={() => setAutoFlip(!autoFlip)}
            style={({ pressed }) => [
              styles.toggleButton,
              pressed && styles.toggleButtonPressed
            ]}
          >
            <Text style={styles.toggleButtonText}>
              {autoFlip ? 'Giro Automático: LIGADO' : 'Giro Automático: DESLIGADO'}
            </Text>
          </Pressable>

        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Classe safeArea deletada!
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, 
  },
  content: {
    width: '100%',
    maxWidth: 480, 
    gap: 12, 
  },
  hudWrapper: {
    borderRadius: 12, 
    borderWidth: 1,
  },
  activeBorder: {
    borderColor: 'rgba(59, 130, 246, 0.5)', 
  },
  inactiveBorder: {
    borderColor: 'transparent',
  },
  boardWrapper: {
    zIndex: 10,
  },
  toggleButton: {
    width: '100%',
    paddingVertical: 12, 
    borderRadius: 12, 
    backgroundColor: '#0f172a', 
    borderWidth: 1,
    borderColor: '#334155', 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  toggleButtonPressed: {
    backgroundColor: '#1e293b', 
  },
  toggleButtonText: {
    fontSize: 12, 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5, 
    color: '#94a3b8', 
  }
});
