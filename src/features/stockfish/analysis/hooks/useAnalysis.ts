// src/features/stockfish/analysis/hooks/useAnalysis.ts
import { useEffect, useMemo, useState } from 'react';
import { analysisService, AnalisePosicao } from '@/features/stockfish/analysis/service/analysis.service';
import { openingService, ChessOpening } from '@/features/stockfish/analysis/service/opening.service';

export function useAnalysis(gameFen: string, isEvalBarEnabled: boolean = false, depth: number = 15) {
  const [analysisState, setAnalysisState] = useState<{ fen: string; value: AnalisePosicao } | null>(null);
  const currentOpening = useMemo<ChessOpening | null>(() => {
    openingService.loadOpenings();
    return gameFen ? openingService.getOpening(gameFen) : null;
  }, [gameFen]);

  // Efeito 2: Processa a avaliação do motor e a abertura do FEN atual
  useEffect(() => {
    if (!gameFen || !isEvalBarEnabled) {
      return;
    }

    analysisService.startAnalysis(gameFen, depth, (novaAnalise) => {
      setAnalysisState({ fen: gameFen, value: novaAnalise });
    });

    return () => {
      analysisService.stopAnalysis();
    };
  }, [gameFen, depth, isEvalBarEnabled]);

  const analise = isEvalBarEnabled && analysisState?.fen === gameFen
    ? analysisState.value
    : null;

  // Retorno padronizado para bater exatamente com a desestruturação do seu useMatch
  return {
    evalData: analise ? {
      ...analise,
      vantagemBrancas: analise.vantagemBrancas,
      isMate: analise.tipo === 'mate'
    } : null,
    currentOpening
  };
}

