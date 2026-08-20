// src/routes/AppRoutes.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';

// Telas
import { LoginView } from '@/features/auth/view/LoginView';
import { RegisterView } from '@/features/auth/view/RegisterView';
import { DashboardView } from '@/features/dashboard/view/DashBoardView';
import { BotView } from '@/features/botselection/view/BotView';
import { TimeView } from '@/features/timeselection/view/TimeView';
import { MatchView } from '@/features/match/view/MatchView'; 
import { ProfileView } from '@/features/profile/ProfileView'; 
import { GameModeView } from '@/features/gamemode/view/GameModeView';
import { GameLocal } from '@/features/match/view/GameLocalView';
import { MatchAnalysis } from '@/features/matchanalysis/view/MatchAnalysis';

// Tipagem estrita das rotas (Evita enviar parâmetros errados no navigate)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Bots: undefined;
  Time: { bot?: any; tipoPartida?: string; guestName?: string }; 
  Match: { partidaData: any; botOponente?: any; isEvalBarEnabled: boolean };
  GameLocal: { partidaData: any; isEvalBarEnabled: boolean };
  LocalView: undefined;
  GameMode: undefined;
  Profile: undefined;
  Analysis: { 
    partidaData: any; 
    moveHistory: any; 
    fenHistory: any; 
    avaliacoesLocais: any; 
    moveCoordsHistory: any; 
    minhaCor: string; 
    botOponente?: any; 
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false, // Esconde a barra nativa superior, já fizemos os nossos próprios headers!
          animation: 'fade', // Transição de tela suave
          contentStyle: { backgroundColor: '#020617' } // Fundo padrão para não piscar branco nas transições
        }}
      >
        {/* Lógica condicional: Se não estiver logado, só existe o fluxo de entrada */}
        {!isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen name="Register" component={RegisterView} />
          </Stack.Group>
        ) : (
          /* Fluxo Principal (só existe se estiver autenticado) */
          <Stack.Group>
            <Stack.Screen name="Dashboard" component={DashboardView} />
            <Stack.Screen name="Profile" component={ProfileView} />
            <Stack.Screen name="GameMode" component={GameModeView} />
            <Stack.Screen name="Bots" component={BotView} />
            <Stack.Screen name="Time" component={TimeView} />
            
            <Stack.Screen 
              name="Match" 
              component={MatchView} 
              options={{ gestureEnabled: false }} // Bloqueia o "arrastar pra voltar" no meio da partida
            />
            <Stack.Screen 
              name="GameLocal" 
              component={GameLocal} 
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Analysis" component={MatchAnalysis} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

