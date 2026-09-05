// src/components/board/hooks/useChessClock.ts
import { useState, useEffect } from 'react';

/**
 * Gerencia a contagem regressiva e a sincronização do relógio com o servidor.
 */
export function useChessClock(
  segundosRecebidos: number | null, 
  isActive: boolean,
  isGameOver: boolean
) {
  const [clockState, setClockState] = useState({
    received: segundosRecebidos,
    remaining: segundosRecebidos || 0,
  });

  if (clockState.received !== segundosRecebidos) {
    setClockState({
      received: segundosRecebidos,
      remaining: segundosRecebidos || 0,
    });
  }

  const timeLeft = clockState.received === segundosRecebidos
    ? clockState.remaining
    : segundosRecebidos || 0;

  // Cronômetro Visual: Executa a redução de 1 segundo a cada 1000ms quando o turno está ativo
  useEffect(() => {
    // Cláusula de guarda para interromper o relógio se o jogo acabar ou o tempo esgotar
    if (segundosRecebidos === null || !isActive || isGameOver || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setClockState((prev) => {
        if (prev.remaining <= 1) return { ...prev, remaining: 0 };
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, isGameOver, segundosRecebidos, timeLeft]);

  // Tratamento para partidas amistosas (sem limite de tempo)
  if (segundosRecebidos === null) {
    return { formato: '∞', isLowTime: false, isZero: false };
  }

  // Lógica de formatação temporal:
  // Para converter os segundos em minutos e segundos restantes:
  // $$mins = \lfloor \frac{timeLeft}{60} \rfloor$$
  // $$secs = timeLeft \pmod{60}$$
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  
  // Retorna o tempo formatado em string MM:SS
  const formato = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    formato,
    isLowTime: timeLeft <= 30 && timeLeft > 0, // Alerta visual para menos de 30 segundos
    isZero: timeLeft === 0,
  };
}
