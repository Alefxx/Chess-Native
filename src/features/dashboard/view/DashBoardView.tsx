// src/features/dashboard/view/DashboardView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export function DashboardView() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);

  const [bounceAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bounceAnim]);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';

    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Logo size="sm" />

          <UserProfileWidget
            nome={user?.nome || 'Jogador'}
            rating={user?.rating || 1500}
            iniciais={getIniciais(user?.nome)}
            foto={user?.foto}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.main}>

          {/* TEXTO */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Pronto para a{' '}
              <Text style={styles.highlight}>Batalha?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Inicie uma nova partida, analise seus movimentos ou estude
              estratégias de grandes mestres.
            </Text>
          </View>

          {/* BOTÃO */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{ translateY: bounceAnim }],
              },
            ]}
          >
            <Button
              label="JOGAR AGORA"
              size="lg"
              onPress={() => navigation.navigate('GameMode')}
            />
          </Animated.View>

        </View>

      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  /* =========================
     HEADER
     ========================= */

  header: {
    width: '100%',
    minHeight: 56,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    zIndex: 10,
  },

  /* =========================
     MAIN
     ========================= */

  main: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },

  /* =========================
     TEXTO
     ========================= */

  textContainer: {
    width: '100%',

    alignItems: 'center',

    paddingHorizontal: 8,
  },

  title: {
    fontSize: 36,
    lineHeight: 42,

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
    maxWidth: 320,

    color: '#94a3b8',

    fontSize: 16,
    lineHeight: 24,

    textAlign: 'center',
  },

  /* =========================
     BOTÃO
     ========================= */

  buttonContainer: {
    marginTop: 48,
    width: '100%',
    maxWidth: 320,
  },
});
