// src/features/stockfish/classificationmoves/hooks/useMoveClassification.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { analysisService, AnalisePosicao } from '../../analysis/service/analysis.service';
import { MoveClassifierService } from '../service/moveClassifier.service';
import { openingService } from '../../analysis/service/opening.service';

export function useMoveClassification(
  historicoRealFens: string[], 
  isEvalBarEnabled: boolean,
  onAvaliacaoPronta: (codigo: number, id: number) => void 
) {
  
  const [avaliados, setAvaliados] = useState(0);
  
  const avaliacoes = useRef<AnalisePosicao[]>([]);
  const indiceAtual = useRef<number>(0);
  
  const isProcessando = useRef(false);
  const isPausado = useRef(isEvalBarEnabled); 
  const isMounted = useRef(true);
  const historicoRef = useRef(historicoRealFens);

  useEffect(() => {
    historicoRef.current = historicoRealFens;
  }, [historicoRealFens]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      isPausado.current = true;
      analysisService.stopAnalysis();
    };
  }, []);

  const processarFilaBackground = useCallback(async () => {
    if (isProcessando.current || isPausado.current) return;
    
    isProcessando.current = true;

    while (indiceAtual.current < historicoRef.current.length && !isPausado.current && isMounted.current) {
      const fenAtual = historicoRef.current[indiceAtual.current];
      
      try {
        const isStart = openingService.isStartPosition(fenAtual);
        const opening = openingService.getOpening(fenAtual);

        if (isStart || opening) {
          // Mock adaptado para bater exatamente com a interface Mobile (AnalisePosicao)
          const analiseNeutra: AnalisePosicao = { 
            tipo: 'cp', 
            valorOriginal: 0,
            vantagemBrancas: 0, 
          };

          avaliacoes.current[indiceAtual.current] = analiseNeutra;

          if (indiceAtual.current > 0) {
            onAvaliacaoPronta(0, indiceAtual.current); 
          }
        } 
        else {
          const analiseFinal = await analysisService.avaliarFenSincrono(fenAtual, 15);
          if (!isMounted.current || isPausado.current) break;
          avaliacoes.current[indiceAtual.current] = analiseFinal;

          if (indiceAtual.current > 0) {
             const evalAnterior = avaliacoes.current[indiceAtual.current - 1];
             const corQueJogou = fenAtual.split(' ')[1] === 'b' ? 'w' : 'b';
             
             const codigo = MoveClassifierService.classificar(evalAnterior, analiseFinal, corQueJogou);
             onAvaliacaoPronta(codigo, indiceAtual.current); 
          }
        }

        indiceAtual.current += 1;
        if (isMounted.current) {
          setAvaliados(indiceAtual.current);
        }
        
      } catch (error) {
        console.error("Erro na avaliação da fila em background:", error);
        break; 
      }
    }

    isProcessando.current = false;
  }, [onAvaliacaoPronta]);

  useEffect(() => {
    isPausado.current = isEvalBarEnabled;
    if (!isEvalBarEnabled) {
      processarFilaBackground();
    }
  }, [isEvalBarEnabled, processarFilaBackground]);

  useEffect(() => {
    if (!isPausado.current && historicoRealFens.length > indiceAtual.current) {
      processarFilaBackground();
    }
  }, [historicoRealFens.length, processarFilaBackground]);

  const iniciarAvaliacaoFimDeJogo = useCallback(() => {
    isPausado.current = false;
    processarFilaBackground();
  }, [processarFilaBackground]);

  const pararAvaliacao = useCallback(() => {
    isPausado.current = true;
    analysisService.stopAnalysis(); 
  }, []);

  return {
    progressoFila: { avaliados, total: historicoRealFens.length },
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao
  };
}

