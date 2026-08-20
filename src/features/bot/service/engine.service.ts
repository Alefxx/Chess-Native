// src/features/bot/service/engine.service.ts

export class EngineService {
  public isReady = false;

  // ==========================================================
  // ARQUITETURA MOBILE: Ponte com o WebView
  // ==========================================================
  
  public sendMessageToEngine: ((msg: string) => void) | null = null;
  private currentOnMessageListener: ((linha: string) => void) | null = null;

  public receiveMessageFromEngine(linha: string) {
    if (linha === 'uciok') {
      this.isReady = true;
      if (this.sendMessageToEngine) {
        this.sendMessageToEngine('isready');
      }
    }

    if (this.currentOnMessageListener) {
      this.currentOnMessageListener(linha);
    }
  }

  public initEngine() {
    if (this.sendMessageToEngine) {
      this.sendMessageToEngine('uci');
    }
  }

  // ==========================================================
  // LÓGICA DE JOGO
  // ==========================================================

  public getBestMove(fen: string, depth: number = 1, skillLevel: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.sendMessageToEngine) {
        return reject("Motor não conectado. A ponte de envio falhou.");
      }

      this.currentOnMessageListener = (linha: string) => {
        if (linha.startsWith('bestmove')) {
          const move = linha.split(' ')[1];
          this.currentOnMessageListener = null; // Limpa o listener
          resolve(move);
        }
      };
      
      this.sendMessageToEngine(`setoption name Skill Level value ${skillLevel}`);
      
      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;
        
      this.sendMessageToEngine(`position fen ${posicaoFen}`);
      this.sendMessageToEngine(`go depth ${depth}`);
    });
  }
}

export const engineService = new EngineService();
