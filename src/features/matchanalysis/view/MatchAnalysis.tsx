// src/screens/MatchAnalysis.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LogOut } from 'lucide-react-native';

import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { CapturedPieces } from '@/components/board/CapturedPieces'; 
import { EvalBar } from '@/components/board/EvalBar';
import { CheckAlert } from '@/components/board/CheckAlert';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';

import { NavigationArrow } from '@/components/analysis/NavigationArrow';
import { MoveQualityIcon, MoveQuality } from '@/components/analysis/MoveQualityIcon';

// Hooks
import { useAuthStore } from '@/store/authStore';
import { useMatchAnalysis } from '@/features/matchanalysis/hooks/useMatchAnalysis';
import { useAnalysis } from '@/features/stockfish/analysis/hooks/useAnalysis';
import { Button } from '@/components/ui/Button';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do Layout

const QUALITY_MAP: Record<number, MoveQuality> = {
  0: 'book',
  1: 'best',
  2: 'great',
  3: 'inaccuracy',
  4: 'mistake',
  5: 'blunder',
};

export function MatchAnalysis() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const currentUser = useAuthStore((state) => state.user);

  // Coleta de parâmetros nativa
  const partidaData = route.params?.partidaData;
  const minhaCor = route.params?.minhaCor || 'branca';
  const botOponente = route.params?.botOponente;
  
  const moveHistory = route.params?.moveHistory || [];
  const avaliacoesLocais = route.params?.avaliacoesLocais || [];
  const fenHistory = route.params?.fenHistory || [];
  const moveCoordsHistory = route.params?.moveCoordsHistory || [];

  useEffect(() => {
    if (!partidaData || !currentUser) {
      navigation.replace('Dashboard');
    }
  }, [partidaData, currentUser, navigation]);

  const { 
    currentMoveIndex, gameFen, lastMove, isCheck, 
    isFirstMove, isLastMove, nextMove, prevMove, goToMove 
  } = useMatchAnalysis(fenHistory, moveHistory, moveCoordsHistory);

  const { evalData, currentOpening } = useAnalysis(gameFen, true);

  const vantagemBrancas = evalData?.vantagemBrancas || 0;
  const isMate = evalData?.tipo === 'mate';

  if (!partidaData || !currentUser) return null;

  const currentQualityCode = currentMoveIndex > 0 ? avaliacoesLocais[currentMoveIndex - 1] : null;
  const currentQuality = (currentQualityCode !== null && currentQualityCode !== undefined) 
    ? QUALITY_MAP[currentQualityCode] 
    : null;

  const getCombinedStyles = () => {
    const styles: Record<string, ViewStyle> = {}; 
    if (lastMove) {
      styles[lastMove.origem] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[lastMove.destino] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    return styles;
  };

  return (
    // Substituindo SafeAreaView pelo ScreenLayout com noPadding
    <ScreenLayout noPadding>
      <View style={styles.container}>
        
        {/* Bloco 1: Adversário */}
        <View style={styles.playerBlock}>
          <View style={styles.playerHeader}>
            <UserProfileWidget 
              nome={partidaData.jogadores.pretas} 
              rating={botOponente?.rating || 1500} 
              iniciais="OP" 
              foto={botOponente?.foto}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Análise</Text>
            </View>
          </View>
          <CapturedPieces fen={gameFen} capturedColor={minhaCor === 'branca' ? 'white' : 'black'} />
        </View>

        {/* Bloco 2: Tabuleiro + EvalBar */}
        <View style={styles.boardWrapper}>
          <View style={styles.evalBarContainer}>
            <EvalBar vantagemBrancas={vantagemBrancas} isMate={isMate} isInvertida={minhaCor === 'preta'} />
          </View>

          <View style={styles.boardContainer}>
            <CheckAlert isCheck={isCheck} />

            <CustomChessboard 
              fen={gameFen} 
              boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
              onSquareClick={() => {}} // Tabuleiro travado durante análise
              customSquareStyles={getCombinedStyles()}
            />

            {/* Controles de Navegação da Análise */}
            <View style={styles.controlsWrapper}>
              <View style={styles.controlsRow}>
                <NavigationArrow direction="left" onPress={prevMove} disabled={isFirstMove} />

                <View style={styles.qualityCenter}>
                  {currentQuality ? (
                    <View style={styles.qualityTag}>
                      <MoveQualityIcon quality={currentQuality} />
                      <Text style={styles.qualityText}>
                        {currentQuality === 'book' ? 'Teoria' :
                         currentQuality === 'best' ? 'Excelente' : 
                         currentQuality === 'great' ? 'Boa' : 
                         currentQuality === 'inaccuracy' ? 'Imprecisão' : 
                         currentQuality === 'mistake' ? 'Erro' : 'Capivara'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.initialPosText}>Posição Inicial</Text>
                  )}
                </View>

                <NavigationArrow direction="right" onPress={nextMove} disabled={isLastMove} />
              </View>
              
              {/* Exibe a abertura */}
              {currentOpening && (
                <View style={styles.openingWrapper}>
                  <Text style={styles.openingText}>
                    {currentOpening.name} ({currentOpening.eco})
                  </Text>
                </View>
              )}
            </View>

          </View>
        </View>

        {/* Bloco 3: Jogador */}
        <View style={styles.playerBlock}>
          <CapturedPieces fen={gameFen} capturedColor={minhaCor === 'branca' ? 'black' : 'white'} />
          <View style={[styles.playerHeader, { marginTop: 4 }]}>
            <UserProfileWidget 
              nome={currentUser.nome} 
              rating={currentUser.rating} 
              iniciais={currentUser.nome.substring(0,2).toUpperCase()} 
            />
          </View>
        </View>

        {/* Bloco 4: Histórico e Ações Finais */}
        <View style={styles.footer}>
          <MoveHistoryBoard 
            pgnHistory={moveHistory} 
            onProporEmpate={() => {}} 
            onAbandonar={() => {}}   
          />
          
          <View style={styles.exitWrapper}>
            <Button 
              label="Sair da Análise" 
              variant="danger" 
              onPress={() => navigation.navigate('Dashboard')}
              icon={<LogOut size={18} color="#fff" />}
            />
          </View>
        </View>
        
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // safeArea removido
  container: {
    flex: 1,
    paddingHorizontal: 8, // Mantemos o padding mais justo para sobrar espaço pro Tabuleiro
    paddingVertical: 16,
    gap: 8,
  },
  playerBlock: {
    zIndex: 10,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)', 
    padding: 8,
    borderRadius: 8,
  },
  badge: {
    backgroundColor: '#0f172a', 
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#64748b', 
    fontWeight: '600',
    fontSize: 12,
  },
  boardWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    zIndex: 20,
  },
  evalBarContainer: {
    flexShrink: 0,
  },
  boardContainer: {
    flex: 1,
    position: 'relative',
  },
  controlsWrapper: {
    marginTop: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.6)', 
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155', 
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 14,
  },
  initialPosText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  openingWrapper: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
  },
  openingText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    flex: 1, 
    gap: 8,
    marginTop: 8,
  },
  exitWrapper: {
    marginTop: 'auto',
  }
});
