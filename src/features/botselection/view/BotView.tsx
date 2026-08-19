// src/features/matchconfig/BotView.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
// Lembre-se: o BotCard que refatoramos antes está na pasta ui ou botselection
import { BotCard } from '@/components/ui/BotCard'; 
import { Bot, botService } from '@/features/botselection/service/bot.service';

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
    <SafeAreaView style={styles.safeArea}>
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
            // A substituição do Grid-cols-2 por FlexWrap
            <View style={styles.grid}>
              {bots.map((bot) => (
                <View key={bot.id} style={styles.gridItem}>
                  <BotCard 
                    bot={bot} 
                    isSelected={selectedBotId === bot.id}
                    onPress={() => setSelectedBotId(bot.id)} // Atualizado para a prop onPress do RN
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // Presumindo fundo escuro
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 896, // max-w-4xl (para se alinhar bem em tablets se necessário)
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    marginBottom: 32, // mb-8
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24, // md:text-3xl
    fontWeight: '900', // font-black
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  highlight: {
    color: '#38bdf8', // text-analysis-blue
  },
  subtitle: {
    color: '#94a3b8', // text-slate-400
    fontSize: 14, // text-sm
    marginTop: 2,
  },
  scrollArea: {
    flex: 1, // Faz a lista tomar todo o espaço disponível
  },
  scrollContent: {
    paddingBottom: 24, // Espaçamento extra no fim da lista
  },
  centerState: {
    paddingTop: 80, // py-20
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
    justifyContent: 'space-between', // Espalha as colunas para os cantos
    rowGap: 16, // gap entre linhas
  },
  gridItem: {
    // Calculado para dar exatamente 2 colunas com um pequeno espaço no meio.
    // 48% permite que duas cartas caibam lado a lado confortavelmente.
    width: '48%', 
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 32, // pb-12
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // Um divisor sutil
    backgroundColor: '#020617', // Garante que o fundo não seja transparente
  }
});

