// src/components/board/GameOverModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Trophy, Frown, Minus, CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

// Assumindo que a tela de resumo já foi refatorada para React Native
import { AnalysisSummaryScreen, MoveStats } from '@/components/analysis/PlayReport'; 

interface GameOverModalProps {
  vencedor: 'branca' | 'preta' | null;
  motivo: string;
  minhaCor: 'branca' | 'preta';
  progressoFila?: { avaliados: number; total: number };
  stats?: MoveStats;
  onAvaliar?: () => void;
  onVerNoTabuleiro: () => void;
  onClose: () => void;
}

export function GameOverModal({ 
  vencedor, 
  motivo, 
  minhaCor, 
  progressoFila, 
  stats,
  onAvaliar, 
  onVerNoTabuleiro,
  onClose 
}: GameOverModalProps) {
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const defaultStats: MoveStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; 
  const safeStats = stats || defaultStats;

  if (showSummary) {
    return (
      // Envolvendo o Resumo no Modal nativo também
      <Modal transparent={true} visible={true} animationType="slide" onRequestClose={onClose}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0f172a' }]}>
          <AnalysisSummaryScreen 
            stats={safeStats} 
            onVerNoTabuleiro={onVerNoTabuleiro} 
            onVoltarAoMenu={onClose} 
          />
        </View>
      </Modal>
    );
  }

  const isEmpate = vencedor === null;
  const isVitoria = vencedor === minhaCor;

  let Icon = Minus;
  let title = "Empate";
  let colorHex = "#94a3b8"; 

  if (!isEmpate) {
    if (isVitoria) {
      Icon = Trophy;
      title = "Você Venceu!";
      colorHex = "#facc15"; 
    } else {
      Icon = Frown;
      title = "Você Perdeu";
      colorHex = "#f87171"; 
    }
  }

  const pAvaliados = progressoFila?.avaliados || 0;
  const pTotal = progressoFila?.total || 0;
  const progressPercent = pTotal > 0 ? Math.round((pAvaliados / pTotal) * 100) : 0;
  const isFinished = isEvaluating && pTotal > 0 && pAvaliados === pTotal;

  return (
    // AQUI ESTÁ O MODAL NATIVO QUE EU ESQUECI!
    <Modal
      transparent={true}
      visible={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          <View style={styles.iconContainer}>
            <Icon size={48} color={colorHex} />
          </View>
          
          <Text style={[styles.title, { color: colorHex }]}>{title}</Text>
          <Text style={styles.subtitle}>
            Por {motivo.replace('-', ' ')}
          </Text>
          
          {!isEvaluating ? (
            <View style={styles.actionsContainer}>
              <Button 
                label="Avaliar Partida" 
                variant="primary" 
                onPress={() => { setIsEvaluating(true); onAvaliar?.(); }} 
              />
              <Button 
                label="Menu Superior" 
                variant="secondary" 
                onPress={onClose} 
              />
            </View>
          ) : !isFinished ? (
            <View style={styles.evaluatingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" style={styles.spinner} />
              <Text style={styles.evalTitle}>Avaliando jogadas...</Text>
              <Text style={styles.evalSubtitle}>{pAvaliados} de {pTotal} lances</Text>
              
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>

              <Button label="Cancelar" variant="secondary" onPress={onClose} />
            </View>
          ) : (
            <View style={styles.evaluatingContainer}>
              <CheckCircle2 size={40} color="#10b981" style={styles.spinner} />
              <Text style={styles.evalTitle}>Avaliação Concluída!</Text>
              
              <Button 
                label="Ver Relatório" 
                variant="primary" 
                onPress={() => setShowSummary(true)} 
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, // 'flex: 1' em vez de 'absolute' faz o Modal nativo preencher a tela inteira com facilidade
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#0f172a', 
    padding: 32, 
    borderRadius: 16, 
    borderWidth: 1,
    borderColor: '#334155', 
    alignItems: 'center',
    width: '100%',
    maxWidth: 320, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    padding: 16, 
    borderRadius: 9999,
    backgroundColor: '#1e293b', 
    marginBottom: 16, 
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#cbd5e1', 
    fontWeight: 'bold', // Alterado para bold para garantir estabilidade no Android
    marginBottom: 4, 
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 12, 
    marginTop: 16, 
  },
  evaluatingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  spinner: {
    marginBottom: 12, 
  },
  evalTitle: {
    color: '#fff',
    fontWeight: 'bold', 
    fontSize: 14, 
    marginBottom: 4, 
  },
  evalSubtitle: {
    color: '#94a3b8', 
    fontSize: 12, 
    marginBottom: 16, 
  },
  progressTrack: {
    width: '100%',
    height: 8, 
    backgroundColor: '#334155', 
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 24, 
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6', 
  }
});
