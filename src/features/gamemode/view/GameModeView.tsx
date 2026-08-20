// src/features/gamemode/view/GameModeView.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
      <View style={styles.container}>
        
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
              onPress={() => navigation.navigate('LocalView')} 
            />

            <Button 
              label="Multiplayer Online" 
              size="lg" 
              variant="secondary"
              style={styles.gameModeButton}
              onPress={() => {
                console.log('Modo Multiplayer selecionado');
              }} 
            />
          </View>

        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Removi a classe 'safeArea' que não é mais necessária
  container: {
    flex: 1, 
    // Removi os paddings duplos (horizontal e top)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40, 
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Isso garante que os botões fiquem perfeitamente centralizados verticalmente
    width: '100%',
    alignSelf: 'center', 
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40, 
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
    paddingVertical: 20, 
  }
});
