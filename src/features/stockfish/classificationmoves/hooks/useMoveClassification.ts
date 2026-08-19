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
  
  const [progressoFila, setProgressoFila] = useState({ avaliados: 0, total: 0 });
  
  const avaliacoes = useRef<AnalisePosicao[]>([]);
  const indiceAtual = useRef<number>(0);
  
  const isProcessando = useRef(false);
  const isPausado = useRef(isEvalBarEnabled); 

  useEffect(() => {
    isPausado.current = isEvalBarEnabled;
    if (!isEvalBarEnabled) {
      processarFilaBackground();
    }
  }, [isEvalBarEnabled]);

  useEffect(() => {
    setProgressoFila(p => ({ ...p, total: historicoRealFens.length }));
    
    if (!isPausado.current && historicoRealFens.length > indiceAtual.current) {
      processarFilaBackground();
    }
  }, [historicoRealFens.length]); 

  const processarFilaBackground = useCallback(async () => {
    if (isProcessando.current || isPausado.current) return;
    
    isProcessando.current = true;

    while (indiceAtual.current < historicoRealFens.length && !isPausado.current) {
      const fenAtual = historicoRealFens[indiceAtual.current];
      
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
          avaliacoes.current[indiceAtual.current] = analiseFinal;

          if (indiceAtual.current > 0) {
             const evalAnterior = avaliacoes.current[indiceAtual.current - 1];
             const corQueJogou = fenAtual.split(' ')[1] === 'b' ? 'w' : 'b';
             
             const codigo = MoveClassifierService.classificar(evalAnterior, analiseFinal, corQueJogou);
             onAvaliacaoPronta(codigo, indiceAtual.current); 
          }
        }

        indiceAtual.current += 1;
        setProgressoFila(p => ({ ...p, avaliados: indiceAtual.current }));
        
      } catch (error) {
        console.error("Erro na avaliação da fila em background:", error);
        break; 
      }
    }

    isProcessando.current = false;
  }, [historicoRealFens, onAvaliacaoPronta]);

  const iniciarAvaliacaoFimDeJogo = useCallback(() => {
    isPausado.current = false;
    processarFilaBackground();
  }, [processarFilaBackground]);

  const pararAvaliacao = useCallback(() => {
    isPausado.current = true;
    analysisService.stopAnalysis(); 
  }, []);

  return {
    progressoFila,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao
  };
}

