import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate: () => void;
  onAbandonar: () => void;
}

export function MoveHistoryBoard({ pgnHistory, onProporEmpate, onAbandonar }: MoveHistoryBoardProps) {
  const turnos = [];
  for (let i = 0; i < pgnHistory.length; i += 2) {
    turnos.push({
      numero: Math.floor(i / 2) + 1,
      brancas: pgnHistory[i],
      pretas: pgnHistory[i + 1]
    });
  }

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Trophy size={14} color="#94a3b8" />
        <Text style={styles.headerText}>Histórico de Lances</Text>
      </View>
      
      {/* Lista de Movimentos */}
      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {turnos.length === 0 ? (
          <Text style={styles.emptyText}>Aguardando o primeiro lance...</Text>
        ) : (
          turnos.map((turno) => (
            // Flex row substitui o Grid
            <View key={turno.numero} style={styles.row}>
              <Text style={styles.colNumber}>{turno.numero}.</Text>
              <Text style={styles.colMoveWhite}>{turno.brancas}</Text>
              <Text style={styles.colMoveBlack}>{turno.pretas || ''}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Ações da Partida */}
      <View style={styles.actionsContainer}>
        {/* Envolvemos os botões em Views com flex: 1 para terem larguras iguais, 
            simulando o grid-cols-2 */}
        <View style={{ flex: 1 }}>
          <Button 
            label="Empate" 
            variant="secondary" 
            // no RN, se quiser um botão menor, ajuste as props internas dele
            onPress={onProporEmpate}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button 
            label="Abandonar" 
            variant="danger" 
            onPress={onAbandonar}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // flex-1
    backgroundColor: '#1e293b', // bg-slate-800
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    padding: 16, // p-4
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    marginBottom: 16, // mb-4
    paddingBottom: 8, // pb-2
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerText: {
    color: '#94a3b8', // text-slate-400
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12, // text-xs
    letterSpacing: 1.5, // tracking-widest (aproximado)
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, // py-1
  },
  colNumber: {
    width: 40, // Substitui o 30px do grid, demos um pouquinho a mais pro mobile
    color: '#64748b', // text-slate-500
    fontFamily: 'monospace', // font-mono
    fontSize: 14,
  },
  colMoveWhite: {
    flex: 1, // 1fr do grid
    fontWeight: 'bold',
    color: '#cbd5e1', // text-slate-300
    fontFamily: 'monospace',
    fontSize: 14,
  },
  colMoveBlack: {
    flex: 1, // 1fr do grid
    color: '#94a3b8', // text-slate-400
    fontFamily: 'monospace',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b', // text-slate-500
    fontStyle: 'italic',
    marginTop: 16,
  },
  actionsContainer: {
    marginTop: 16, // mt-4
    paddingTop: 16, // pt-4
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexDirection: 'row',
    gap: 8, // grid-cols-2 gap-2 (flex row com gap atende perfeitamente)
  }
});

