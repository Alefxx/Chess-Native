// src/features/match/hooks/useMatch.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

import { useBoardStateMatch } from './useBoardStateMatch';
import { useClockMatch } from './useClockMatch';
import { useGameRulesMatch } from './useGameRulesMatch';
import { useBidHistoryMatch } from './useBidHistoryMatch';
import { useStockfishMatch } from './useStockfishMatch';
import { useAnalysis } from '@/features/stockfish/analysis/hooks/useAnalysis'; 
import { useMoveClassification } from '@/features/stockfish/classificationmoves/hooks/useMoveClassification';
import { useMatchAnalysisMemory } from './useMatchAnalysisMemory'; 

/**
 * Hook Orquestrador: Coordena a comunicação entre sub-hooks e o backend.
 */
export function useMatch(partidaData: any, currentUser: any, botOponente?: Bot, isEvalBarEnabled: boolean = false) {
  const partidaId: string | undefined = partidaData?.partidaId;
  const [isMovePending, setIsMovePending] = useState(false);
  const [gameError, setGameError] = useState('');
  const moveInFlight = useRef(false);
  const selectionRequest = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      selectionRequest.current += 1;
    };
  }, []);
  
  const board = useBoardStateMatch(partidaData, currentUser);
  const clock = useClockMatch(partidaData);
  const rules = useGameRulesMatch();
  const history = useBidHistoryMatch();
  const {
    gameFen,
    isMinhaVez,
    minhaCor,
    moveSquares,
    pieceSquare,
    setGameFen,
    setLastMove,
    setMoveSquares,
    setPieceSquare,
  } = board;
  const { atualizarTempos } = clock;
  const { atualizarHistorico } = history;
  const { atualizarRegras, gameOver, pendingPromotion, setPendingPromotion } = rules;

  // Delegação do armazenamento e processamento de estatísticas para o hook especializado
  const memory = useMatchAnalysisMemory({
    partidaId,
    fenInicial: partidaData?.fen,
    minhaCor
  });
  const { registrarQuadroHistorico } = memory;

  // ATUALIZAÇÃO: Nova assinatura do useAnalysis interceptando a abertura
  const { evalData, currentOpening } = useAnalysis(gameFen, isEvalBarEnabled);
  const vantagemBrancas = evalData?.vantagemBrancas || 0;
  const isMate = evalData?.tipo === 'mate';

  // ATUALIZAÇÃO: Fila consumindo o histórico em array (memory.fenHistory) em vez do FEN isolado da tela
  const { 
    progressoFila, 
    iniciarAvaliacaoFimDeJogo, 
    pararAvaliacao 
  } = useMoveClassification(memory.fenHistory, isEvalBarEnabled, memory.registrarAvaliacaoLocal);

  const processarRespostaServidor = useCallback((response: any, moveRealizado?: { origem: string; destino: string }) => {
    if (!mounted.current) return;
    atualizarTempos(response.tempos);
    setGameFen(response.fen);
    atualizarHistorico(response.pgn);
    atualizarRegras(response.statusPartida, response.detalhes);

    // Delega o salvamento do histórico visual para o hook de memória
    registrarQuadroHistorico(response.fen, moveRealizado);

    if (moveRealizado) {
      setLastMove(moveRealizado);
    }
  }, [atualizarHistorico, atualizarRegras, atualizarTempos, registrarQuadroHistorico, setGameFen, setLastMove]);

  const { botError } = useStockfishMatch({
    partidaId,
    gameFen,
    isMinhaVez,
    minhaCor,
    isGameOver: !!gameOver,
    isPendingPromotion: !!pendingPromotion,
    botOponente,
    onBotMoveSuccess: processarRespostaServidor
  });

  const realizarMovimento = useCallback(async (origem: string, destino: string, pecaPromocao?: string) => {
    if (moveInFlight.current || !partidaId) return false;

    moveInFlight.current = true;
    setIsMovePending(true);
    setGameError('');

    try {
      setPieceSquare('');
      setMoveSquares({});

      // ATUALIZAÇÃO: Não enviamos mais a corDoTurnoAtual (Segurança do Backend garantida)
      const payload: any = { origem, destino };
      if (pecaPromocao) payload.promocao = pecaPromocao;

      const response = await matchService.executarMovimento(partidaId, payload);

      if (response.sucesso) {
        if (response.requerPromocao) {
           setPendingPromotion({ origem, destino });
           return false; 
        }

        if (response.fen) {
            setPendingPromotion(null);
            processarRespostaServidor(response, { origem, destino });
            return true; 
        }
      }
      if (mounted.current) setGameError(response.mensagem || 'Esse movimento não é válido.');
      return false; 
    } catch (error: any) {
      console.error("[JOGADOR] Falha de comunicação no movimento:", error);
      if (mounted.current) setGameError(error.message || 'Não foi possível realizar o movimento.');
      return false;
    } finally {
      moveInFlight.current = false;
      if (mounted.current) setIsMovePending(false);
    }
  }, [partidaId, processarRespostaServidor, setMoveSquares, setPendingPromotion, setPieceSquare]);

  const onSquareClick = useCallback(async (square: string) => {
    if (moveInFlight.current || !isMinhaVez || gameOver || pendingPromotion || !partidaId) return;

    setGameError('');
    const requestId = ++selectionRequest.current;

    if (pieceSquare === square) {
      setPieceSquare('');
      setMoveSquares({});
      return;
    }

    if (pieceSquare && moveSquares[square]) {
      await realizarMovimento(pieceSquare, square);
      return;
    }

    try {
      const movimentos = await matchService.obterMovimentos(partidaId, square, minhaCor);
      if (!mounted.current || requestId !== selectionRequest.current) return;
      
      if (movimentos && movimentos.length > 0) {
        setPieceSquare(square);
        
        const novosEstilos: Record<string, any> = { [square]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } };
        movimentos.forEach((mov: any) => {
          const casaDestino = typeof mov === 'string' ? mov : (mov.destino || mov.casa || mov);
          
          // ATUALIZAÇÃO MOBILE: Trocamos o gradiente CSS radial por estilos nativos
          novosEstilos[casaDestino] = {
            backgroundColor: 'rgba(136, 196, 37, 0.4)', // Fundo verde suave 
            borderWidth: 2,                             // Borda de destaque
            borderColor: 'rgba(136, 196, 37, 0.8)'
          };
        });
        setMoveSquares(novosEstilos);
      } else {
        setPieceSquare('');
        setMoveSquares({});
      }
    } catch (error) {
      if (!mounted.current || requestId !== selectionRequest.current) return;
      console.error("[JOGADOR] Erro ao buscar movimentos válidos para a peça selecionada.", error);
      setGameError('Não foi possível consultar os movimentos dessa peça.');
      setPieceSquare('');
      setMoveSquares({});
    }
  }, [gameOver, isMinhaVez, minhaCor, moveSquares, partidaId, pendingPromotion, pieceSquare, realizarMovimento, setMoveSquares, setPieceSquare]);

  // NOVO: Função para o jogador desistir da partida atual
  const abandonarPartida = useCallback(async () => {
    if (moveInFlight.current || !partidaId) return;
    moveInFlight.current = true;
    setIsMovePending(true);
    setGameError('');
    try {
      const response = await matchService.desistirPartida(partidaId, minhaCor);
      
      // Se sucesso, passa o novo status (fimDeJogo = true, motivo = abandono) pro GameRules
      if (response.sucesso && response.statusPartida) {
        atualizarRegras(response.statusPartida);
      }
    } catch (error: any) {
      console.error("[JOGADOR] Erro ao desistir:", error);
      if (mounted.current) setGameError(error.message || 'Não foi possível abandonar a partida.');
    } finally {
      moveInFlight.current = false;
      if (mounted.current) setIsMovePending(false);
    }
  }, [atualizarRegras, minhaCor, partidaId]);

  useEffect(() => {
    if (!partidaId || gameOver) return;

    let active = true;
    const sincronizar = async () => {
      try {
        const response = await matchService.sincronizarRelogio(partidaId);
        if (!active || !response?.sucesso) return;
        atualizarTempos(response.tempos);
        if (response.tempos.fimNoTempo) {
          atualizarRegras({
            fimDeJogo: true,
            vencedor: response.tempos.vencedorPorTempo,
            motivo: 'tempo'
          });
        }
      } catch {
        // A sincronização periódica é oportunista; o próximo lance continua autoritativo.
      }
    };

    sincronizar();
    const interval = setInterval(sincronizar, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [atualizarRegras, atualizarTempos, gameOver, partidaId]);

  return {
    gameFen: board.gameFen,
    minhaCor: board.minhaCor,
    moveSquares: board.moveSquares,
    lastMove: board.lastMove, 
    moveHistory: history.moveHistory,
    isCheck: rules.isCheck,
    gameOver: rules.gameOver,
    pendingPromotion: rules.pendingPromotion,
    tempoBrancas: clock.tempoBrancas,
    tempoPretas: clock.tempoPretas,
    
    // Variáveis passadas para a UI
    vantagemBrancas, 
    isMate,
    currentOpening,
    progressoFila,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao,          
    onSquareClick,
    realizarMovimento,
    abandonarPartida, // <-- Função exposta para a View
    isMovePending,
    gameError: gameError || botError,
    
    avaliacoesLocais: memory.avaliacoesLocais, 
    fenHistory: memory.fenHistory,
    moveCoordsHistory: memory.moveCoordsHistory,
    minhasEstatisticas: memory.minhasEstatisticas
  };
}

