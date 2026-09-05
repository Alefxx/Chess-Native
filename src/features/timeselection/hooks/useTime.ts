// src/features/timeselection/hooks/useTime.ts
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { timeService, TimeOption } from '@/features/timeselection/service/time.service';
import { matchService } from '@/features/match/service/match.service';
import { useAuthStore } from '@/store/authStore';
import { PlayerColor } from '@/components/ui/ColorSelector';

export function useTime() {
  const [tempos, setTempos] = useState<TimeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('random');
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
  const [isEvalBarEnabled, setIsEvalBarEnabled] = useState(false);
  const createInFlight = useRef(false);
  const mounted = useRef(true);

  // ATUALIZAÇÃO MOBILE: Hooks do React Navigation
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const currentUser = useAuthStore((state) => state.user);
  
  // ATUALIZAÇÃO MOBILE: Lendo parâmetros de route.params
  const botOponente = route.params?.bot; 
  const tipoPartida = route.params?.tipoPartida || 'bot'; 
  const guestName = route.params?.guestName || 'Visitante';

  useEffect(() => {
    let active = true;
    mounted.current = true;

    if (!botOponente && tipoPartida !== 'local') {
      navigation.replace('Dashboard');
      return;
    }

    const fetchTempos = async () => {
      try {
        setIsLoading(true);
        const data = await timeService.listarTempos();
        if (active) setTempos(data);
      } catch {
        if (active) setErrorMsg('Erro ao carregar configurações de tempo.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchTempos();
    return () => {
      active = false;
      mounted.current = false;
    };
  }, [botOponente, tipoPartida, navigation]);

  const handleConfirmar = async () => {
    if (createInFlight.current || !selectedTimeId || !currentUser) return;
    if (tipoPartida === 'bot' && !botOponente) return;

    try {
      createInFlight.current = true;
      setIsCreatingMatch(true);
      setErrorMsg('');

      let brancasUsername = '';
      let pretasUsername = '';

      const corDefinitiva = selectedColor === 'random' 
        ? (Math.random() > 0.5 ? 'white' : 'black') 
        : selectedColor;

      const oponenteNome = tipoPartida === 'local' ? guestName : botOponente.nome;

      if (corDefinitiva === 'white') {
        brancasUsername = currentUser.username;
        pretasUsername = oponenteNome; 
      } else {
        brancasUsername = oponenteNome;
        pretasUsername = currentUser.username;
      }

      const respostaPartida = await matchService.criarPartida({
        brancasUsername,
        pretasUsername,
        tempoId: selectedTimeId,
        tipoPartida: tipoPartida 
      });

      // ATUALIZAÇÃO MOBILE: Passando os dados no navigate e usando o nome das telas configuradas
      if (respostaPartida.tipoPartida === 'local') {
        navigation.replace('GameLocal', { partidaData: respostaPartida, isEvalBarEnabled });
      } else {
        navigation.replace('Match', { partidaData: respostaPartida, botOponente, isEvalBarEnabled });
      }

    } catch (error: any) {
      if (mounted.current) setErrorMsg(error.message || 'Erro ao iniciar partida no servidor.');
    } finally {
      createInFlight.current = false;
      if (mounted.current) setIsCreatingMatch(false);
    }
  };

  return {
    tempos,
    isLoading,
    isCreatingMatch,
    errorMsg,
    selectedColor,
    setSelectedColor,
    selectedTimeId,
    setSelectedTimeId,
    botOponente,
    tipoPartida, 
    guestName,   
    isEvalBarEnabled, 
    setIsEvalBarEnabled, 
    handleConfirmar,
    navigation // Retornamos navigation ao invés de navigate
  };
}

