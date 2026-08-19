// src/components/board/GameOverModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Trophy, Frown, Minus, Activity, CheckCircle2 } from 'lucide-react-native';
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

  const defaultStats: MoveStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Adicionado 0 para bater com a tela anterior
  const safeStats = stats || defaultStats;

  if (showSummary) {
    return (
      // StyleSheet.absoluteFillObject faz a View preencher toda a tela
      <View style={[StyleSheet.absoluteFillObject, { zIndex: 50 }]}>
        <AnalysisSummaryScreen 
          stats={safeStats} 
          onVerNoTabuleiro={onVerNoTabuleiro} 
          onVoltarAoMenu={onClose} 
        />
      </View>
    );
  }

  const isEmpate = vencedor === null;
  const isVitoria = vencedor === minhaCor;

  let Icon = Minus;
  let title = "Empate";
  let colorHex = "#94a3b8"; // text-slate-400

  if (!isEmpate) {
    if (isVitoria) {
      Icon = Trophy;
      title = "Você Venceu!";
      colorHex = "#facc15"; // text-yellow-400
    } else {
      Icon = Frown;
      title = "Você Perdeu";
      colorHex = "#f87171"; // text-red-400
    }
  }

  const pAvaliados = progressoFila?.avaliados || 0;
  const pTotal = progressoFila?.total || 0;
  const progressPercent = pTotal > 0 ? Math.round((pAvaliados / pTotal) * 100) : 0;
  const isFinished = isEvaluating && pTotal > 0 && pAvaliados === pTotal;

  return (
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
              // onClick virou onPress
              onPress={() => { setIsEvaluating(true); onAvaliar?.(); }} 
              icon={<Activity size={18} color="#fff" />}
            />
            <Button 
              label="Menu Superior" 
              variant="secondary" 
              onPress={onClose} 
            />
          </View>
        ) : !isFinished ? (
          <View style={styles.evaluatingContainer}>
            {/* O ActivityIndicator substitui o Loader2 animado */}
            <ActivityIndicator size="large" color="#3b82f6" style={styles.spinner} />
            <Text style={styles.evalTitle}>Avaliando jogadas...</Text>
            <Text style={styles.evalSubtitle}>{pAvaliados} de {pTotal} lances</Text>
            
            <View style={styles.progressTrack}>
              {/* No React Native, a largura aceita strings de porcentagem nativamente! */}
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
              // Se quiser sobrescrever a cor do botão primário para verde no RN, faça via prop de estilo no Button
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // bg-black/80
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#0f172a', // bg-slate-900
    padding: 32, // p-8
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    alignItems: 'center',
    width: '100%',
    maxWidth: 320, // max-w-sm (aprox)
    // shadow-2xl aproximação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    padding: 16, // p-4
    borderRadius: 9999,
    backgroundColor: '#1e293b', // bg-slate-800
    marginBottom: 16, // mb-4
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: '900', // font-black
    marginBottom: 8, // mb-2
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#cbd5e1', // text-slate-300
    fontWeight: '500',
    marginBottom: 4, // mb-1
    textTransform: 'capitalize',
  },
  actionsContainer: {
    width: '100%',
    gap: 12, // flex flex-col gap-3
    marginTop: 16, // mt-4
  },
  evaluatingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // bg-slate-800/50
    padding: 16, // p-4
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  spinner: {
    marginBottom: 12, // mb-3
  },
  evalTitle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14, // text-sm
    marginBottom: 4, // mb-1
  },
  evalSubtitle: {
    color: '#94a3b8', // text-slate-400
    fontSize: 12, // text-xs
    marginBottom: 16, // mb-4
  },
  progressTrack: {
    width: '100%',
    height: 8, // h-2
    backgroundColor: '#334155', // bg-slate-700
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 24, // mb-6
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6', // bg-analysis-blue (assumi azul)
    // O RN não tem transition-all nativo simples no CSS, para a barra animar 
    // suavemente precisaria do Animated, mas a largura % já quebra um super galho
  }
});

