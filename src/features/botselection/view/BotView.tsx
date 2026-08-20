// src/features/matchconfig/BotView.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { BotCard } from '@/components/ui/BotCard'; 
import { Bot, botService } from '@/features/botselection/service/bot.service';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do Layout Profissional!

export function BotView() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setIsLoading(true);
        const data = await botService.listarBots();
        setBots(data);
      } catch (error) {
        setErrorMsg('Erro ao carregar os adversários. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleAvancar = () => {
    if (!selectedBotId) return;
    const botEscolhido = bots.find(b => b.id === selectedBotId);
    
    // O envio de parâmetros via React Navigation é direto no segundo argumento
    navigation.navigate('Time', { bot: botEscolhido });
  };

  return (
    // Substituindo o SafeAreaView pelo nosso ScreenLayout
    <ScreenLayout>
      <View style={styles.container}>
        
        {/* Cabeçalho de Navegação */}
        <View style={styles.header}>
          <IconButton 
            icon={<ArrowLeft size={24} color="#cbd5e1" />} 
            onPress={() => navigation.navigate('Dashboard')} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Escolha seu <Text style={styles.highlight}>Oponente</Text>
            </Text>
            <Text style={styles.subtitle}>
              Selecione uma Inteligência Artificial para desafiar.
            </Text>
          </View>
        </View>

        {/* Área Rolável para a Lista de Bots */}
        <ScrollView 
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Carregando motores de xadrez...</Text>
            </View>
          ) : errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {bots.map((bot) => (
                <View key={bot.id} style={styles.gridItem}>
                  <BotCard 
                    bot={bot} 
                    isSelected={selectedBotId === bot.id}
                    onPress={() => setSelectedBotId(bot.id)} 
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Rodapé Fixo de Ação */}
        {!isLoading && !errorMsg && (
          <View style={styles.footer}>
            <Button 
              label="CONTINUAR" 
              size="lg" 
              variant={selectedBotId ? 'primary' : 'secondary'}
              onPress={handleAvancar}
            />
          </View>
        )}

      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Classe safeArea removida
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 896, 
    alignSelf: 'center',
    // paddings duplicados removidos
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, 
    marginBottom: 32, 
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24, 
    fontWeight: '900', 
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  highlight: {
    color: '#38bdf8', 
  },
  subtitle: {
    color: '#94a3b8', 
    fontSize: 14, 
    marginTop: 2,
  },
  scrollArea: {
    flex: 1, 
  },
  scrollContent: {
    paddingBottom: 24, 
  },
  centerState: {
    paddingTop: 80, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 16,
    fontWeight: '500',
  },
  errorBox: {
    padding: 16,
    backgroundColor: 'rgba(127, 29, 29, 0.5)',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#fecaca',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    rowGap: 16, 
  },
  gridItem: {
    width: '48%', 
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 16, // Ajustado de 32 para 16
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', 
    // backgroundColor removido pois o ScreenLayout já garante o fundo certo
  }
});
