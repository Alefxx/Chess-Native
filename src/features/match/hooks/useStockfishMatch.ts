// src/features/match/hooks/useStockfishMatch.ts
import { useState, useEffect, useRef } from 'react';
import { engineService } from '@/features/stockfish/bot/service/engine.service';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

interface UseStockfishProps {
  partidaId?: string;
  gameFen: string;
  isMinhaVez: boolean;
  minhaCor: 'branca' | 'preta';
  isGameOver: boolean;
  isPendingPromotion: boolean;
  botOponente?: Bot;
  onBotMoveSuccess: (response: any, moveRealizado: { origem: string, destino: string }) => void; 
}

export function useStockfishMatch({
  partidaId,
  gameFen,
  isMinhaVez,
  minhaCor,
  isGameOver,
  isPendingPromotion,
  botOponente,
  onBotMoveSuccess
}: UseStockfishProps) {
  
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [botError, setBotError] = useState('');
  const isBusy = useRef(false);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let thinkTimer: ReturnType<typeof setTimeout> | undefined;
    let retryCount = 0;

    const fazerJogadaBot = () => {
      const podeJogar = partidaId && !isMinhaVez && botOponente &&
                        !isBusy.current && !gameFen.includes('game over') && !isGameOver && !isPendingPromotion;

      if (podeJogar) {
        if (!engineService.isReady || !engineService.sendMessageToEngine) {
          retryCount += 1;
          if (retryCount === 20 && active) {
            setBotError('O motor de xadrez está demorando para iniciar. Verifique a conexão.');
          }
          retryTimer = setTimeout(fazerJogadaBot, 500);
          return;
        }

        thinkTimer = setTimeout(async () => {
          if (!active || isBusy.current) return;
          isBusy.current = true;
          setIsBotThinking(true);
          setBotError('');

          try {
            const config = botOponente.configStockfish;
            const bestMove = await engineService.getBestMove(gameFen, config.depth, config.skillLevel);

            if (active && bestMove && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(bestMove)) {
              const origem = bestMove.substring(0, 2);
              const destino = bestMove.substring(2, 4);
              const promocao = bestMove.length === 5 ? bestMove[4] : undefined;
              const corBot = minhaCor === 'branca' ? 'preta' : 'branca';
              const response = await matchService.executarMovimento(partidaId, {
                origem,
                destino,
                corDoTurnoAtual: corBot,
                promocao
              });

              if (active && response.sucesso && response.fen) {
                onBotMoveSuccess(response, { origem, destino });
              } else if (active) {
                setBotError(response.mensagem || 'O servidor recusou a jogada do bot.');
              }
            } else if (active) {
              setBotError('O motor não conseguiu calcular uma jogada.');
            }
          } catch (error: any) {
            console.error("[BOT] Falha ao calcular a jogada:", error.message || error);
            if (active) setBotError('Não foi possível calcular a jogada do bot.');
          } finally {
            isBusy.current = false;
            if (active) setIsBotThinking(false);
          }
        }, 700);
      }
    };

    fazerJogadaBot();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      if (thinkTimer) clearTimeout(thinkTimer);
      engineService.cancelPendingMove();
    };
  }, [gameFen, isMinhaVez, minhaCor, partidaId, botOponente, isGameOver, isPendingPromotion, onBotMoveSuccess]);

  return { isBotThinking, botError };
}
