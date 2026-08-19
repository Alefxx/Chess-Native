// src/features/stockfish/analysis/service/opening.service.ts

export interface ChessOpening {
  eco: string;
  name: string;
  moves: string;
  aliases?: Record<string, string>;
}

class OpeningService {
  private dictionary: Record<string, ChessOpening> | null = null;
  private readonly START_FEN_BASE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  // No React Native, substituímos o fetch pelo require (bundle direto)
  async loadOpenings(): Promise<void> {
    if (this.dictionary) return;
    try {
      // Mova o seu ecoA.json para a pasta src/assets/data/ecoA.json
      this.dictionary = require('../../../../assets/data/ecoA.json');
      console.log("[OpeningService] Livro de aberturas carregado instantaneamente da memória local.");
    } catch (error) {
      console.error("[OpeningService] Erro ao carregar o livro de aberturas:", error);
    }
  }

  getOpening(fen: string): ChessOpening | null {
    if (!this.dictionary) return null;

    const exactMatch = this.dictionary[fen];
    if (exactMatch) return exactMatch;

    const baseFen = fen.split(' ').slice(0, 4).join(' ');
    
    for (const key in this.dictionary) {
      if (key.startsWith(baseFen)) {
        return this.dictionary[key];
      }
    }

    return null;
  }

  isStartPosition(fen: string): boolean {
    return fen.startsWith(this.START_FEN_BASE);
  }
}

export const openingService = new OpeningService();

