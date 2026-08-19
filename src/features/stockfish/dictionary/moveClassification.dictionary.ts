// src/features/stockfish/dictionary/moveClassification.dictionary.ts
import { Sparkles, Check, HelpCircle, AlertTriangle, XOctagon, BookOpen } from 'lucide-react-native'; // Versão Nativa

export const MoveDictionary = {
  0: { 
    label: 'Livro', 
    colorHex: '#a8a29e', // text-stone-400
    bgHex: 'rgba(168, 162, 158, 0.1)', // bg-stone-400/10
    Icon: BookOpen 
  },
  1: { 
    label: 'Excelente', 
    colorHex: '#22d3ee', // text-cyan-400
    bgHex: 'rgba(34, 211, 238, 0.1)', // bg-cyan-400/10
    Icon: Sparkles 
  },
  2: { 
    label: 'Boa', 
    colorHex: '#34d399', // text-emerald-400
    bgHex: 'rgba(52, 211, 153, 0.1)', // bg-emerald-400/10
    Icon: Check 
  },
  3: { 
    label: 'Imprecisão', 
    colorHex: '#facc15', // text-yellow-400
    bgHex: 'rgba(250, 204, 21, 0.1)', // bg-yellow-400/10
    Icon: HelpCircle 
  },
  4: { 
    label: 'Erro', 
    colorHex: '#fb923c', // text-orange-400
    bgHex: 'rgba(251, 146, 60, 0.1)', // bg-orange-400/10
    Icon: AlertTriangle 
  },
  5: { 
    label: 'Capivara', 
    colorHex: '#ef4444', // text-red-500
    bgHex: 'rgba(239, 68, 68, 0.1)', // bg-red-500/10
    Icon: XOctagon 
  }
} as const;

export type MoveCode = keyof typeof MoveDictionary;

