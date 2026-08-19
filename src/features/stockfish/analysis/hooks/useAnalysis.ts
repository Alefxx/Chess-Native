// src/features/stockfish/analysis/hooks/useAnalysis.ts
import { useState, useEffect } from 'react';
import { analysisService, AnalisePosicao } from '@/features/stockfish/analysis/service/analysis.service';
import { openingService, ChessOpening } from '@/features/stockfish/analysis/service/opening.service';

export function useAnalysis(gameFen: string, isEvalBarEnabled: boolean = false, depth: number = 15) {
  const [analise, setAnalise] = useState<AnalisePosicao | null>(null);
  const [currentOpening, setCurrentOpening] = useState<ChessOpening | null>(null);

  // Efeito 1: Carrega o livro de aberturas na montagem
  useEffect(() => {
    openingService.loadOpenings();
  }, []);

  // Efeito 2: Processa a avaliação do motor e a abertura do FEN atual
  useEffect(() => {
    // Busca a abertura em tempo real independente do motor estar ligado ou não
    if (gameFen) {
      setCurrentOpening(openingService.getOpening(gameFen));
    }

    if (!gameFen || !isEvalBarEnabled) {
      setAnalise(null);
      return;
    }

    analysisService.startAnalysis(gameFen, depth, (novaAnalise) => {
      setAnalise(novaAnalise);
    });

    return () => {
      analysisService.stopAnalysis();
    };
  }, [gameFen, depth, isEvalBarEnabled]);

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

