// src/features/dashboard/view/DashboardView.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

export function DashboardView() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);

  // Valor animado para o efeito de "bounce" (flutuar) do botão
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Cria um laço infinito subindo -10px e voltando a 0px
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { 
          toValue: -10, 
          duration: 1500, // slow bounce
          useNativeDriver: true 
        }),
        Animated.timing(bounceAnim, { 
          toValue: 0, 
          duration: 1500, 
          useNativeDriver: true 
        })
      ])
    ).start();
  }, []);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    // SafeAreaView garante que o header não fique escondido atrás do relógio/câmera do celular
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Navegação Superior: Logo e Atalho para Perfil */}
        <View style={styles.header}>
          <Logo size="sm" />
          
          <UserProfileWidget 
            nome={user?.nome || 'Jogador'}
            rating={user?.rating || 1500}
            iniciais={getIniciais(user?.nome)}
            foto={user?.foto} 
            onPress={() => navigation.navigate('Profile')} // onClick virou onPress
          />
        </View>

        {/* Hero Section: Chamada para ação principal */}
        <View style={styles.main}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Pronto para a <Text style={styles.highlight}>Batalha?</Text>
            </Text>
            <Text style={styles.subtitle}>
              Inicie uma nova partida, analise seus movimentos ou estude estratégias de grandes mestres.
            </Text>
          </View>

          {/* Envolvemos o botão na Animated.View para aplicar o efeito translateY */}
          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <Button 
              label="JOGAR AGORA" 
              size="lg" 
              onPress={() => navigation.navigate('GameMode')} // onClick virou onPress
            />
          </Animated.View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // bg-slate-950 (fundo base do app)
  },
  container: {
    flex: 1, // w-full min-h-[80vh] flex flex-col
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row', // flex justify-between
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40, // mb-16 (reduzido um pouco para ficar mais harmônico em telas pequenas)
  },
  main: {
    flex: 1, // flex-1
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32, // gap-8
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36, // text-3xl md:text-5xl (adaptado pro mobile)
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
    fontSize: 16, // text-base
    textAlign: 'center',
    maxWidth: 320, // max-w-md (mantém a quebra de linha agradável)
    lineHeight: 24, // Melhora a legibilidade
  }
});

