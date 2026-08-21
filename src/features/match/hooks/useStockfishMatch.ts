// src/features/match/hooks/useStockfishMatch.ts
import { useState, useEffect } from 'react';
import { engineService } from '@/features/stockfish/bot/service/engine.service';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

interface UseStockfishProps {
  partidaId: string;
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

  useEffect(() => {
    const fazerJogadaBot = async () => {
      const podeJogar = !isMinhaVez && botOponente && !isBotThinking && 
                        !gameFen.includes('game over') && !isGameOver && !isPendingPromotion;

      if (podeJogar) {
        
        // =========================================================
        // A CORREÇÃO ESTÁ AQUI: O LAÇO DE ESPERA DA INTERNET
        // Se o Netlify ainda estiver carregando, espera 500ms e tenta de novo
        // =========================================================
        if (!engineService.isReady || !engineService.sendMessageToEngine) {
          console.log("[BOT] Aguardando o motor carregar na nuvem...");
          setTimeout(fazerJogadaBot, 500);
          return;
        }

        setIsBotThinking(true); 
        
        try {
          // Delay extra de "raciocínio" para parecer natural
          await new Promise(resolve => setTimeout(resolve, 1000));

          const config = botOponente.configStockfish;
          const bestMove = await engineService.getBestMove(gameFen, config.depth, config.skillLevel); 
          
          if (bestMove) {
            const origem = bestMove.substring(0, 2);
            const destino = bestMove.substring(2, 4);
            const pecaPromocao = bestMove.length === 5 ? bestMove[4] : undefined; 
            const corBot = minhaCor === 'branca' ? 'preta' : 'branca';

            const payloadBot: any = { origem, destino, corDoTurnoAtual: corBot };
            if (pecaPromocao) payloadBot.pecaPromovida = pecaPromocao;

            const response = await matchService.executarMovimento(partidaId, payloadBot);

            if (response.sucesso && response.fen) {
              onBotMoveSuccess(response, { origem, destino });
            }
          }
        } catch (error: any) {
          // Desembrulhando o erro para aparecer bonitinho no seu terminal do Termux
          const erroReal = error.response?.data || error.message || error;
          console.error("[BOT] 🚨 Erro detalhado da IA:", erroReal);
        } finally {
          setIsBotThinking(false); 
        }
      }
    };

    fazerJogadaBot();
    
    // Removendo o isBotThinking do array para evitar loops infinitos de renderização
  }, [gameFen, isMinhaVez, minhaCor, partidaId, botOponente, isGameOver, isPendingPromotion, onBotMoveSuccess]);

  return { isBotThinking };
}
