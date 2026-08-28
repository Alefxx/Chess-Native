// src/features/gamemode/view/GameModeView.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do Layout

export function GameModeView() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    // Substituindo o SafeAreaView raiz pelo nosso ScreenLayout
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Navegação Superior */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => navigation.navigate('Dashboard')} 
            style={({ pressed }) => [pressed && { opacity: 0.7 }]} 
          >
            <Logo size="sm" />
          </Pressable>
          
          <UserProfileWidget 
            nome={user?.nome || 'Jogador'}
            rating={user?.rating || 1500}
            iniciais={getIniciais(user?.nome)}
            foto={user?.foto}
            onPress={() => navigation.navigate('Profile')} 
          />
        </View>

        {/* Conteúdo Principal */}
        <View style={styles.main}>
          
          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Modo de <Text style={styles.highlight}>Jogo</Text>
            </Text>
            <Text style={styles.subtitle}>
              Escolha como você quer jogar a sua próxima partida.
            </Text>
          </View>

          {/* Lista de Modos de Jogo */}
          <View style={styles.buttonGroup}>
            <Button 
              label="Jogar contra Bots" 
              size="lg" 
              variant="primary"
              style={styles.gameModeButton} 
              onPress={() => navigation.navigate('Bots')} 
            />
            
            <Button 
              label="Partida Local" 
              size="lg" 
              variant="secondary"
              style={styles.gameModeButton}
              onPress={() => navigation.navigate('Time', { tipoPartida: 'local', guestName: 'Visitante' })}
            />

            <Button 
              label="Multiplayer Online · Em breve"
              size="lg" 
              variant="secondary"
              style={styles.gameModeButton}
              disabled
            />
          </View>

        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Removi a classe 'safeArea' que não é mais necessária
  container: {
    flexGrow: 1,
    // Removi os paddings duplos (horizontal e top)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  main: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    width: '100%',
    alignSelf: 'center', 
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 36, 
    fontWeight: '900', 
    color: '#ffffff',
    marginBottom: 16, 
    textAlign: 'center',
    letterSpacing: -1,
  },
  highlight: {
    color: '#88c425', 
  },
  subtitle: {
    color: '#94a3b8', 
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 320,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 400, 
    gap: 16, 
  },
  gameModeButton: {
    width: '100%',
    minHeight: 56,
  }
});
