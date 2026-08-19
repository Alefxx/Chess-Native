// src/components/board/PlayerPanel.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Componentes da interface
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { ChessClock } from '@/components/board/ChessClock';
import { CapturedPieces } from '@/components/board/CapturedPieces';

interface PlayerPanelProps {
  nome: string;
  rating: number;
  iniciais: string;
  foto?: string;

  clockFormat: string;
  isClockActive: boolean;
  isLowTime: boolean;

  fen: string;
  capturedColor: 'white' | 'black';
  
  position?: 'top' | 'bottom'; 
}

export function PlayerPanel({
  nome,
  rating,
  iniciais,
  foto,
  clockFormat,
  isClockActive,
  isLowTime,
  fen,
  capturedColor,
  position = 'top'
}: PlayerPanelProps) {
  
  // Bloco 1: Perfil e Relógio
  const ProfileAndClock = (
    <View style={styles.profileRow}>
      <UserProfileWidget 
        nome={nome} 
        rating={rating} 
        iniciais={iniciais} 
        foto={foto}
      />
      <ChessClock 
        formato={clockFormat} 
        isActive={isClockActive} 
        isLowTime={isLowTime} 
      />
    </View>
  );

  // Bloco 2: Peças Capturadas
  const Captured = (
    <CapturedPieces 
      fen={fen} 
      capturedColor={capturedColor} 
    />
  );

  return (
    // View principal agrupando com gap vertical
    <View style={styles.container}>
      {position === 'top' ? (
        <>
          {ProfileAndClock}
          {Captured}
        </>
      ) : (
        <>
          {Captured}
          {ProfileAndClock}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Por garantia, empilha verticalmente
    gap: 4, // gap-1
  },
  profileRow: {
    flexDirection: 'row', // Alinha lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // bg-slate-800/40
    padding: 8, // p-2
    borderRadius: 8, // rounded-lg
  }
});

