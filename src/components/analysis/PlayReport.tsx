// src/screens/AnalysisSummaryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronLeft } from 'lucide-react-native';
// Assumindo que o seu componente Button também será refatorado para React Native
import { Button } from '@/components/ui/Button'; 
import { MoveQualityIcon, MoveQuality } from '@/components/analysis/MoveQualityIcon';

export interface MoveStats {
  0: number; // Lances de Livro (Teoria)
  1: number; // Excelentes
  2: number; // Boas
  3: number; // Imprecisões
  4: number; // Erros
  5: number; // Capivaras
}

interface AnalysisSummaryScreenProps {
  stats: MoveStats;
  onVerNoTabuleiro: () => void;
  onVoltarAoMenu: () => void;
}

// Atualizamos a interface para receber cores diretas ao invés de classes CSS
interface QualityConfig {
  quality: MoveQuality;
  label: string;
  bgColor: string;
  textColor: string;
}

// Usamos rgba para o fundo com 10% de opacidade e hex para o texto
const SUMMARY_CONFIG: Record<keyof MoveStats, QualityConfig> = {
  0: { quality: 'book', label: 'Lances de Livro', bgColor: 'rgba(120, 113, 108, 0.1)', textColor: '#a8a29e' }, // stone
  1: { quality: 'best', label: 'Excelentes', bgColor: 'rgba(234, 179, 8, 0.1)', textColor: '#eab308' },      // yellow
  2: { quality: 'great', label: 'Boas', bgColor: 'rgba(59, 130, 246, 0.1)', textColor: '#3b82f6' },         // blue
  3: { quality: 'inaccuracy', label: 'Imprecisões', bgColor: 'rgba(34, 197, 94, 0.1)', textColor: '#22c55e' },// green
  4: { quality: 'mistake', label: 'Erros', bgColor: 'rgba(249, 115, 22, 0.1)', textColor: '#f97316' },      // orange
  5: { quality: 'blunder', label: 'Capivaras', bgColor: 'rgba(239, 68, 68, 0.1)', textColor: '#ef4444' },     // red
};

export function AnalysisSummaryScreen({ stats, onVerNoTabuleiro, onVoltarAoMenu }: AnalysisSummaryScreenProps) {
  const statKeys = [0, 1, 2, 3, 4, 5] as const;
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 24, 448);

  return (
    // SafeAreaView evita que o conteúdo cole no topo/bottom do celular
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { width: cardWidth }]}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Relatório da Partida</Text>
            <Text style={styles.subtitle}>Resumo da precisão dos seus lances</Text>
          </View>

          <View style={styles.listContainer}>
            {statKeys.map((key) => {
              const config = SUMMARY_CONFIG[key];
              const quantidade = stats[key] || 0;

              return (
                <View 
                  key={key} 
                  style={[
                    styles.statRow, 
                    { backgroundColor: config.bgColor }
                  ]}
                >
                  <View style={styles.statLeft}>
                    <MoveQualityIcon 
                      quality={config.quality} 
                      // Passamos as propriedades equivalentes a "!bg-transparent !p-0 scale-125"
                      style={{ backgroundColor: 'transparent', padding: 0, transform: [{ scale: 1.25 }] }}
                    />
                    <Text style={[styles.statLabel, { color: config.textColor }]}>
                      {config.label}
                    </Text>
                  </View>
                  
                  <View style={styles.valueBadge}>
                    <Text style={[styles.statValue, { color: config.textColor }]}>
                      {quantidade}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.actionContainer}>
            {/* ATENÇÃO: Troquei onClick por onPress para seguir o padrão Mobile */}
            <Button 
              label="Ver no Tabuleiro" 
              variant="primary" 
              onPress={onVerNoTabuleiro} 
              // O ideal é que o componente Button nativo resolva esses estilos internamente
              // style={{ backgroundColor: '#2563eb' ... }} 
              icon={<Search size={22} color="#ffffff" />}
            />
            
            <Button 
              label="Voltar ao Menu" 
              variant="ghost" 
              onPress={onVoltarAoMenu} 
              icon={<ChevronLeft size={18} color="#94a3b8" />}
            />
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: '#020617', // slate-950
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  card: {
    backgroundColor: '#0f172a', // slate-900
    borderColor: '#1e293b', // border-slate-800
    borderWidth: 1,
    borderRadius: 24, // rounded-3xl
    padding: 20,
    shadowColor: '#000', // shadow-2xl aproximação
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center', // text-center
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: '900', // font-black
    color: '#ffffff', // text-white
    marginBottom: 8, // mb-2
    letterSpacing: -0.5, // tracking-tight
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8', // text-slate-400
    fontSize: 14, // text-sm
  },
  listContainer: {
    gap: 8,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)', // border-white/5
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
  },
  statLabel: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
  },
  valueBadge: {
    backgroundColor: 'rgba(2, 6, 23, 0.4)', // bg-slate-950/40
    paddingHorizontal: 16, // px-4
    paddingVertical: 6, // py-1.5
    borderRadius: 12, // rounded-xl
  },
  statValue: {
    fontWeight: '900', // font-black
    fontSize: 20, // text-xl
  },
  actionContainer: {
    gap: 12, // gap-3
  }
});

