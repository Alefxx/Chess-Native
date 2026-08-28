// src/features/matchanalysis/hooks/useMatchAnalysis.ts
import { useState, useCallback } from 'react';

export function useMatchAnalysis(
  fenHistory: string[], 
  pgnHistory: string[], 
  moveCoordsHistory?: {origem: string, destino: string}[]
) {
  const safeFenHistory = fenHistory.length > 0
    ? fenHistory
    : ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'];

  // Começa no último lance do jogo
  const [currentMoveIndex, setCurrentIndex] = useState(Math.max(0, safeFenHistory.length - 1));

  // O índice 0 da Fita é a posição inicial (não há PGN associado a ela)
  const gameFen = safeFenHistory[currentMoveIndex] || safeFenHistory[0];

  // O índice 1 de FEN equivale ao índice 0 do PGN (o primeiro lance jogado)
  const currentPgnMove = currentMoveIndex > 0 ? pgnHistory[currentMoveIndex - 1] : '';

  // Truque inteligente: na notação algébrica (PGN), xeques terminam com + e mates com #
  const isCheck = currentPgnMove.includes('+') || currentPgnMove.includes('#');

  // Coordenadas para manter a origem/destino pintadas de amarelo no tabuleiro
  const lastMove = currentMoveIndex > 0 && moveCoordsHistory 
    ? moveCoordsHistory[currentMoveIndex - 1] 
    : null;

  const nextMove = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, safeFenHistory.length - 1));
  }, [safeFenHistory.length]);

  const prevMove = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0)); // Limita a voltar até o índice 0
  }, []);

  const goToMove = useCallback((index: number) => {
    // Permite navegar livremente clicando no painel de histórico
    if (index >= 0 && index < safeFenHistory.length) {
      setCurrentIndex(index);
    }
  }, [safeFenHistory.length]);

  return {
    currentMoveIndex,
    gameFen,
    lastMove,
    isCheck,
    isFirstMove: currentMoveIndex === 0,
    isLastMove: currentMoveIndex === safeFenHistory.length - 1,
    nextMove,
    prevMove,
    goToMove,
  };
}
