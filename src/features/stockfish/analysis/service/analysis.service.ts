// src/features/stockfish/analysis/service/analysis.service.ts

export interface AnalisePosicao {
  tipo: 'cp' | 'mate'; 
  valorOriginal: number; 
  vantagemBrancas: number; 
}

export class AnalysisService {
  private isAnalyzing = false;
  
  // ARQUITETURA MOBILE: Funções injetadas pelo bridge do React Native
  public sendMessageToEngine: ((msg: string) => void) | null = null;
  private currentOnMessageListener: ((linha: string) => void) | null = null;

  /**
   * Chamado pelo WebView invisível ou Módulo Nativo no React Native 
   * sempre que o Stockfish emitir um output.
   */
  public receiveMessageFromEngine(linha: string) {
    if (this.currentOnMessageListener) {
      this.currentOnMessageListener(linha);
    }
  }

  public stopAnalysis() {
    if (this.isAnalyzing && this.sendMessageToEngine) {
      this.sendMessageToEngine('stop');
      this.isAnalyzing = false;
    }
  }

  /**
   * 1. MÉTODO ORIGINAL (Tempo Real / Streaming)
   */
  public startAnalysis(
    fen: string, 
    depth: number = 15, 
    onUpdate: (analise: AnalisePosicao) => void
  ) {
    this.stopAnalysis(); 
    if (!this.sendMessageToEngine) return;

    this.isAnalyzing = true;
    const isTurnoPretas = fen.includes(' b ');

    // Define o listener para este streaming
    this.currentOnMessageListener = (linha: string) => {
      if (linha.startsWith('info') && linha.includes('score')) {
        const matchCp = linha.match(/score cp (-?\d+)/);
        const matchMate = linha.match(/score mate (-?\d+)/);

        if (matchCp) {
          const valorCp = parseInt(matchCp[1], 10) / 100; 
          const vantagemBrancas = isTurnoPretas ? -valorCp : valorCp;
          onUpdate({ tipo: 'cp', valorOriginal: valorCp, vantagemBrancas });
        } 
        else if (matchMate) {
          const lancesParaMate = parseInt(matchMate[1], 10);
          const vantagemBrancas = isTurnoPretas ? -lancesParaMate : lancesParaMate;
          onUpdate({ tipo: 'mate', valorOriginal: lancesParaMate, vantagemBrancas });
        }
      }
    };

    const posicaoFen = fen === 'start' 
      ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
      : fen;

    this.sendMessageToEngine(`position fen ${posicaoFen}`);
    this.sendMessageToEngine(`go depth ${depth}`);
  }

  /**
   * 2. MÉTODO SÍNCRONO (Fila / Classificação)
   */
  public avaliarFenSincrono(fen: string, depth: number = 15): Promise<AnalisePosicao> {
    return new Promise((resolve, reject) => {
      this.stopAnalysis(); 
      if (!this.sendMessageToEngine) return reject("Motor indisponível");

      this.isAnalyzing = true;
      const isTurnoPretas = fen.includes(' b ');
      let ultimaAnalise: AnalisePosicao | null = null;
      let timeoutFuga: ReturnType<typeof setTimeout> | null = null;

      const finalizar = () => {
        this.isAnalyzing = false;
        if (timeoutFuga) clearTimeout(timeoutFuga);
        
        if (ultimaAnalise) {
          resolve(ultimaAnalise);
        } else {
          resolve({ tipo: 'cp', valorOriginal: 0, vantagemBrancas: 0 });
        }
      };

      // Define o listener para esta Promise
      this.currentOnMessageListener = (linha: string) => {
        if (timeoutFuga) clearTimeout(timeoutFuga);
        timeoutFuga = setTimeout(finalizar, 1500);

        if (linha.startsWith('info') && linha.includes('score')) {
          const matchCp = linha.match(/score cp (-?\d+)/);
          const matchMate = linha.match(/score mate (-?\d+)/);

          if (matchCp) {
            const valorCp = parseInt(matchCp[1], 10) / 100; 
            ultimaAnalise = { tipo: 'cp', valorOriginal: valorCp, vantagemBrancas: isTurnoPretas ? -valorCp : valorCp };
          } 
          else if (matchMate) {
            const lancesParaMate = parseInt(matchMate[1], 10);
            ultimaAnalise = { tipo: 'mate', valorOriginal: lancesParaMate, vantagemBrancas: isTurnoPretas ? -lancesParaMate : lancesParaMate };
            
            if (lancesParaMate === 0) {
              finalizar();
              return; 
            }
          }
        }

        if (linha.startsWith('bestmove')) {
          finalizar();
        }
      };

      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;

      this.sendMessageToEngine(`position fen ${posicaoFen}`);
      this.sendMessageToEngine(`go depth ${depth}`);
      
      timeoutFuga = setTimeout(finalizar, 2000);
    });
  }
}

export const analysisService = new AnalysisService();

