// src/features/bot/service/engine.service.ts

/**
 * Gerencia a comunicação com o motor Stockfish.
 * Refatorado para o padrão Bridge (Mobile): A comunicação real com a thread do motor 
 * (seja via WebView ou Native Module) é injetada na inicialização do App.
 */
export class EngineService {
  public isReady = false;

  // ==========================================================
  // ARQUITETURA MOBILE: Callbacks de Injeção
  // ==========================================================
  
  /**
   * Função que será acoplada pelo App.tsx para enviar strings UCI ao motor nativo/WebView.
   */
  public sendMessageToEngine: ((msg: string) => void) | null = null;
  
  /**
   * Listener temporário que processa a saída atual do motor.
   */
  private currentOnMessageListener: ((linha: string) => void) | null = null;

  /**
   * Método chamado pelo App sempre que o motor emitir um log/saída (stdout).
   */
  public receiveMessageFromEngine(linha: string) {
    // Intercepta a confirmação de boot do protocolo UCI
    if (linha === 'uciok') {
      this.isReady = true;
      if (this.sendMessageToEngine) {
        this.sendMessageToEngine('isready');
      }
    }

    // Repassa a linha para a Promise que estiver aguardando o 'bestmove'
    if (this.currentOnMessageListener) {
      this.currentOnMessageListener(linha);
    }
  }

  /**
   * Inicia o handshake do protocolo UCI.
   * Deve ser chamado pelo App.tsx logo após injetar a função `sendMessageToEngine`.
   */
  public initEngine() {
    if (this.sendMessageToEngine) {
      this.sendMessageToEngine('uci');
    }
  }

  // ==========================================================
  // LÓGICA DE NEGÓCIO DO XADREZ
  // ==========================================================

  /**
   * Solicita ao motor a melhor jogada para uma determinada posição.
   * @param fen String FEN que representa o estado atual do tabuleiro.
   * @param depth Profundidade de análise (quanto maior, mais forte e lento o bot).
   * @param skillLevel Nível de habilidade configurado no Stockfish (0 a 20).
   * @returns Uma Promise que resolve com a string do movimento (ex: "e2e4").
   */
  public getBestMove(fen: string, depth: number = 1, skillLevel: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.sendMessageToEngine) {
        return reject("Motor não conectado. A ponte de envio falhou.");
      }

      /**
       * Escuta as mensagens do motor até encontrar o padrão 'bestmove'.
       */
      this.currentOnMessageListener = (linha: string) => {
        if (linha.startsWith('bestmove')) {
          const move = linha.split(' ')[1];
          // Remove o listener após obter a resposta para liberar a ponte
          this.currentOnMessageListener = null;
          resolve(move);
        }
      };
      
      // Aplica as configurações de força e dificuldade
      this.sendMessageToEngine(`setoption name Skill Level value ${skillLevel}`);
      
      // Define a posição no tabuleiro (converte 'start' para a FEN inicial padrão)
      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;
        
      this.sendMessageToEngine(`position fen ${posicaoFen}`);
      
      // Inicia o cálculo do movimento
      this.sendMessageToEngine(`go depth ${depth}`);
    });
  }
}

// Exporta uma única instância para ser utilizada em toda a aplicação (Singleton)
export const engineService = new EngineService();

