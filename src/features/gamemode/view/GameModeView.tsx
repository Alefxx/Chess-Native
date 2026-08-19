// src/features/gamemode/view/GameModeView.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

export function GameModeView() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Navegação Superior */}
        <View style={styles.header}>
          {/* Envolvemos a Logo em um Pressable para ser tocável */}
          <Pressable 
            onPress={() => navigation.navigate('Dashboard')} // '/' geralmente é a Dashboard
            style={({ pressed }) => [pressed && { opacity: 0.7 }]} // Leve feedback visual
          >
            <Logo size="sm" />
          </Pressable>
          
          <UserProfileWidget 
            nome={user?.nome || 'Jogador'}
            rating={user?.rating || 1500}
            iniciais={getIniciais(user?.nome)}
            foto={user?.foto}
            onPress={() => navigation.navigate('Profile')} // Atualizado para onPress
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
              // Usamos a prop style que preparamos no Button.tsx para forçar o tamanho
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
                // TODO: Redirecionar para o lobby/matchmaking
                console.log('Modo Multiplayer selecionado');
              }} 
            />
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // bg-slate-950
  },
  container: {
    flex: 1, // min-h-[80vh] substituído por tela cheia
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40, // mb-16
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center', // mx-auto
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40, // Espaçamento entre texto e botões (gap-10)
  },
  title: {
    fontSize: 36, // text-3xl md:text-5xl
    fontWeight: '900', // font-black
    color: '#ffffff',
    marginBottom: 16, // mb-4
    textAlign: 'center',
    letterSpacing: -1,
  },
  highlight: {
    color: '#88c425', // text-chess-green
  },
  subtitle: {
    color: '#94a3b8', // text-slate-400
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 320,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 400, // max-w-md
    gap: 16, // flex flex-col gap-4
  },
  gameModeButton: {
    width: '100%',
    paddingVertical: 20, // Simulando o py-5
  }
});

