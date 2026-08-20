// src/routes/AppRoutes.tsx
import React from 'react';
import { View } from 'react-native'; // <-- Importação da View adicionada
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
    // A MÁGICA FINAL AQUI: Envolver o roteador em uma View com flex: 1
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade', 
            // O flex: 1 aqui dentro empurra o fundo até o rodapé
            contentStyle: { backgroundColor: '#020617', flex: 1 } 
          }}
        >
          {!isAuthenticated ? (
            <Stack.Group>
              <Stack.Screen name="Login" component={LoginView} />
              <Stack.Screen name="Register" component={RegisterView} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Dashboard" component={DashboardView} />
              <Stack.Screen name="Profile" component={ProfileView} />
              <Stack.Screen name="GameMode" component={GameModeView} />
              <Stack.Screen name="Bots" component={BotView} />
              <Stack.Screen name="Time" component={TimeView} />
              
              <Stack.Screen 
                name="Match" 
                component={MatchView} 
                options={{ gestureEnabled: false }}
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
    </View>
  );
}
