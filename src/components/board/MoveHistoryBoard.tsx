// src/components/board/MoveHistoryBoard.tsx
import React, { useRef } from 'react'; // <-- Import corrigido e useRef adicionado
import { View, Text, StyleSheet, ScrollView, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate?: () => void;
  onAbandonar?: () => void;
  showActions?: boolean;
  showDrawAction?: boolean;
  actionsDisabled?: boolean;
  onMovePress?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function MoveHistoryBoard({
  pgnHistory,
  onProporEmpate,
  onAbandonar,
  showActions = true,
  showDrawAction = false,
  actionsDisabled = false,
  onMovePress,
  style
}: MoveHistoryBoardProps) {
  // Ref para controlar a rolagem da lista
  const scrollViewRef = useRef<ScrollView>(null);

  const turnos = [];
  for (let i = 0; i < pgnHistory.length; i += 2) {
    turnos.push({
      numero: Math.floor(i / 2) + 1,
      brancas: pgnHistory[i],
      pretas: pgnHistory[i + 1]
    });
  }

  return (
    <View style={[styles.container, style]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Trophy size={14} color="#94a3b8" />
        <Text style={styles.headerText}>Histórico de Lances</Text>
      </View>
      
      {/* Lista de Movimentos */}
      <ScrollView 
        ref={scrollViewRef} // <-- Anexamos a referência aqui
        // Sempre que um lance novo entrar, rola suavemente para o final!
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} 
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {turnos.length === 0 ? (
          <Text style={styles.emptyText}>Aguardando o primeiro lance...</Text>
        ) : (
          turnos.map((turno) => (
            <View key={turno.numero} style={styles.row}>
              <Text style={styles.colNumber}>{turno.numero}.</Text>
              <Pressable
                style={styles.moveButton}
                disabled={!onMovePress}
                onPress={() => onMovePress?.((turno.numero - 1) * 2 + 1)}
              >
                <Text style={styles.colMoveWhite}>{turno.brancas}</Text>
              </Pressable>
              <Pressable
                style={styles.moveButton}
                disabled={!onMovePress || !turno.pretas}
                onPress={() => onMovePress?.((turno.numero - 1) * 2 + 2)}
              >
                <Text style={styles.colMoveBlack}>{turno.pretas || ''}</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {/* Ações da Partida */}
      {showActions && onAbandonar && <View style={styles.actionsContainer}>
        {showDrawAction && <View style={{ flex: 1 }}>
          <Button 
            label="Empate" 
            variant="secondary" 
            onPress={onProporEmpate}
            disabled={actionsDisabled}
          />
        </View>}
        <View style={{ flex: 1 }}>
          <Button 
            label="Abandonar" 
            variant="danger" 
            onPress={onAbandonar}
            disabled={actionsDisabled}
          />
        </View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#0f1d2e',
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#29405c',
    padding: 16, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
    marginBottom: 16, 
    paddingBottom: 8, 
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerText: {
    color: '#94a3b8', 
    fontWeight: 'bold', // Seguro no Android
    textTransform: 'uppercase',
    fontSize: 12, 
    letterSpacing: 1.5, 
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
    paddingVertical: 4, 
  },
  colNumber: {
    width: 40, 
    color: '#64748b', 
    fontFamily: 'monospace', // Perfeito, o Android tem fonte mono nativa padrão
    fontSize: 14,
  },
  colMoveWhite: {
    fontWeight: 'bold',
    color: '#cbd5e1', 
    fontFamily: 'monospace',
    fontSize: 14,
  },
  colMoveBlack: {
    color: '#94a3b8', 
    fontFamily: 'monospace',
    fontSize: 14,
  },
  moveButton: {
    flex: 1,
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b', 
    fontStyle: 'italic',
    marginTop: 16,
  },
  actionsContainer: {
    marginTop: 16, 
    paddingTop: 16, 
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexDirection: 'row',
    gap: 8, 
  }
});
