// src/routes/AppRoutes.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <View style={styles.loading} accessibilityRole="progressbar">
        <ActivityIndicator size="large" color="#a3d65c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade', 
            // O flex: 1 aqui dentro empurra o fundo até o rodapé
            contentStyle: { backgroundColor: '#07111f' }
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
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07111f',
  },
});
