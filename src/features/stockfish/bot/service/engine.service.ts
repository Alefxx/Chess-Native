// src/features/bot/service/engine.service.ts

export class EngineService {
  public isReady = false;
  public sendMessageToEngine: ((msg: string) => void) | null = null;
  private currentOnMessageListener: ((linha: string) => void) | null = null;
  private cancelCurrentRequest: (() => void) | null = null;

  public receiveMessageFromEngine(linha: string) {
    if (linha === 'uciok') {
      this.isReady = true;
      if (this.sendMessageToEngine) this.sendMessageToEngine('isready');
    }
    if (this.currentOnMessageListener) {
      this.currentOnMessageListener(linha);
    }
  }

  public initEngine() {
    if (this.sendMessageToEngine) this.sendMessageToEngine('uci');
  }

  public getBestMove(fen: string, depth: number = 1, skillLevel: number = 0): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.sendMessageToEngine) {
        return reject(new Error("Motor não conectado."));
      }

      this.cancelPendingMove();
      let settled = false;

      const finish = (move: string | null) => {
        if (settled) return;
        settled = true;
        clearTimeout(fallbackTimeout);
        this.currentOnMessageListener = null;
        this.cancelCurrentRequest = null;
        resolve(move);
      };

      const fallbackTimeout = setTimeout(() => {
        finish(null);
      }, 15000);

      this.cancelCurrentRequest = () => finish(null);

      this.currentOnMessageListener = (linha: string) => {
        if (linha.startsWith('bestmove')) {
          const move = linha.split(' ')[1];
          finish(move);
        }
      };
      
      this.sendMessageToEngine(`setoption name Skill Level value ${skillLevel}`);
      
      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;
      this.sendMessageToEngine('ucinewgame'); 
      this.sendMessageToEngine(`position fen ${posicaoFen}`);
      this.sendMessageToEngine(`go depth ${depth}`);
    });
  }

  public cancelPendingMove() {
    if (this.cancelCurrentRequest) {
      this.sendMessageToEngine?.('stop');
      this.cancelCurrentRequest();
    }
  }
}

export const engineService = new EngineService();
