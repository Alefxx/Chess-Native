// src/features/timeselection/view/TimeView.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, ActivityIndicator } from 'react-native';
import { ArrowLeft, Clock, Activity } from 'lucide-react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { useTime } from '../hooks/useTime'; 
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do nosso Layout Profissional!
import { TimeCategorySection } from '@/components/ui/TimeCategorySection';
import { groupTimeOptions, TimeCategoryKey } from '../utils/timeCategories';

export function TimeView() {
  const {
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
    navigation
  } = useTime();

  const isMultiplayer = false; 
  const scrollRef = useRef<ScrollView>(null);
  const [expandedCategories, setExpandedCategories] = useState<Partial<Record<TimeCategoryKey, boolean>>>({});
  const timeCategories = useMemo(() => groupTimeOptions(tempos), [tempos]);

  const [switchAnim] = useState(() => new Animated.Value(isEvalBarEnabled ? 1 : 0));

  useEffect(() => {
    Animated.timing(switchAnim, {
      toValue: isEvalBarEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [isEvalBarEnabled, switchAnim]);

  const thumbTranslateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22] 
  });

  const handleTimeSelect = (id: string) => {
    setSelectedTimeId(id);
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    // Substituímos o SafeAreaView e a View root pelo nosso ScreenLayout
    <ScreenLayout>
      <View style={styles.container}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <IconButton 
            icon={<ArrowLeft size={24} color="#ffffff" />} 
            onPress={() => navigation.goBack()} 
            accessibilityLabel="Voltar"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Configurar <Text style={styles.highlight}>Partida</Text>
            </Text>
            <Text style={styles.subtitle}>
              Contra: <Text style={styles.opponentName}>
                {tipoPartida === 'local' ? guestName : botOponente?.nome}
              </Text>
            </Text>
          </View>
        </View>

        <ScrollView 
          ref={scrollRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção da Cor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Com qual cor você joga?</Text>
            <ColorSelector 
              selected={selectedColor} 
              onSelect={setSelectedColor} 
              isMultiplayer={isMultiplayer} 
            />
          </View>

          {/* Seção do Tempo */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Clock size={16} color="#94a3b8" />
              <Text style={styles.sectionTitle}>Controle de Tempo</Text>
            </View>

            {isLoading ? (
              <View style={styles.centerState}>
                <ActivityIndicator size="large" color="#38bdf8" />
                <Text style={styles.loadingText}>Carregando relógios...</Text>
              </View>
            ) : errorMsg && tempos.length === 0 ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : (
              <View style={styles.categories}>
                {timeCategories.map((category) => (
                  <TimeCategorySection
                    key={category.key}
                    label={category.label}
                    description={category.description}
                    times={category.times}
                    expanded={!!expandedCategories[category.key]}
                    selectedTimeId={selectedTimeId}
                    onSelect={handleTimeSelect}
                    onToggle={() => setExpandedCategories((current) => ({
                      ...current,
                      [category.key]: !current[category.key],
                    }))}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Seção do Switch da Barra de Avaliação */}
          {!isLoading && tempos.length > 0 && (
            <View style={styles.toggleSection}>
              <Pressable 
                onPress={() => setIsEvalBarEnabled(!isEvalBarEnabled)}
                accessibilityRole="switch"
                accessibilityLabel="Barra de avaliação"
                accessibilityState={{ checked: isEvalBarEnabled }}
                style={({ pressed }) => [
                  styles.toggleCard,
                  pressed && { backgroundColor: '#1e293b' }
                ]}
              >
                <View style={styles.toggleInfo}>
                  <View style={[styles.iconWrapper, isEvalBarEnabled ? styles.iconActive : styles.iconInactive]}>
                    <Activity size={20} color={isEvalBarEnabled ? "#38bdf8" : "#94a3b8"} />
                  </View>
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleTitle}>Barra de Avaliação</Text>
                    <Text style={styles.toggleSubtitle}>Mostra a vantagem do motor em tempo real</Text>
                  </View>
                </View>
                
                {/* Switch Visual Nativo-like */}
                <View style={[styles.switchTrack, isEvalBarEnabled ? styles.switchTrackOn : styles.switchTrackOff]}>
                  <Animated.View style={[styles.switchThumb, { transform: [{ translateX: thumbTranslateX }] }]} />
                </View>
              </Pressable>
            </View>
          )}

          {!isLoading && tempos.length > 0 && errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {!isLoading && tempos.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerHint}>
                {selectedTimeId ? 'Tudo pronto para começar.' : 'Escolha um controle de tempo.'}
              </Text>
              <Button
                label="Jogar"
                size="lg"
                variant={selectedTimeId ? 'primary' : 'secondary'}
                onPress={handleConfirmar}
                loading={isCreatingMatch}
                disabled={!selectedTimeId}
              />
            </View>
          )}
        </ScrollView>

      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Removi a classe 'safeArea' que estava sobrando
  container: { flex: 1, width: '100%', maxWidth: 896, alignSelf: 'center' }, // Removi os paddings repetidos daqui
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 },
  highlight: { color: '#88c425' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 2 },
  opponentName: { color: '#38bdf8', fontWeight: 'bold' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 24, gap: 32 },
  
  section: { width: '100%' },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 12, textAlign: 'center' },
  
  centerState: { paddingVertical: 40, alignItems: 'center' },
  loadingText: { color: '#64748b', marginTop: 12 },
  errorBox: { padding: 16, backgroundColor: 'rgba(127, 29, 29, 0.5)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 8, alignItems: 'center' },
  errorText: { color: '#fecaca', textAlign: 'center' },
  
  categories: { gap: 14 },
  
  toggleSection: { alignItems: 'center', marginTop: 8 },
  toggleCard: { width: '100%', maxWidth: 448, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.5)' },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleText: { flex: 1 },
  iconWrapper: { padding: 8, borderRadius: 8 },
  iconActive: { backgroundColor: 'rgba(56, 189, 248, 0.2)' },
  iconInactive: { backgroundColor: '#334155' },
  toggleTitle: { color: '#ffffff', fontWeight: '500', fontSize: 14 },
  toggleSubtitle: { color: '#94a3b8', fontSize: 10, marginTop: 2, flexShrink: 1 },
  
  switchTrack: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center' },
  switchTrackOn: { backgroundColor: '#38bdf8' },
  switchTrackOff: { backgroundColor: '#475569' },
  switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },

  footer: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    gap: 10,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
  },
  footerHint: { color: '#94a3b8', fontSize: 12, textAlign: 'center' },
});
