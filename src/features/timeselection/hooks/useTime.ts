// src/features/timeselection/hooks/useTime.ts
import { useEffect, useState } from 'react';
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

  // ATUALIZAÇÃO MOBILE: Hooks do React Navigation
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const currentUser = useAuthStore((state) => state.user);
  
  // ATUALIZAÇÃO MOBILE: Lendo parâmetros de route.params
  const botOponente = route.params?.bot; 
  const tipoPartida = route.params?.tipoPartida || 'bot'; 
  const guestName = route.params?.guestName || 'Visitante';

  useEffect(() => {
    if (!botOponente && tipoPartida !== 'local') {
      navigation.replace('Dashboard');
      return;
    }

    const fetchTempos = async () => {
      try {
        setIsLoading(true);
        const data = await timeService.listarTempos();
        setTempos(data);
      } catch (error) {
        setErrorMsg('Erro ao carregar configurações de tempo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTempos();
  }, [botOponente, tipoPartida, navigation]);

  const handleConfirmar = async () => {
    if (!selectedTimeId || !currentUser) return;
    if (tipoPartida === 'bot' && !botOponente) return;

    try {
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
        navigation.navigate('GameLocal', { partidaData: respostaPartida, isEvalBarEnabled });
      } else {
        navigation.navigate('Match', { partidaData: respostaPartida, botOponente, isEvalBarEnabled });
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.erro || 'Erro ao iniciar partida no servidor.');
    } finally {
      setIsCreatingMatch(false);
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

