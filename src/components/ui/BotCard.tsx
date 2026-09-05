// src/components/botselection/BotCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Cpu } from 'lucide-react-native';

// Assumindo que a interface Bot venha do seu service
import { Bot } from '@/features/botselection/service/bot.service';

interface BotCardProps {
  bot: Bot;
  isSelected: boolean;
  onPress: () => void; // Renomeado de onClick
}

export function BotCard({ bot, isSelected, onPress }: BotCardProps) {
  // Estado para controlar se a imagem quebrou
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${bot.nome}, ${bot.rating} ELO`}
      style={({ pressed }) => [
        styles.cardBase,
        isSelected ? styles.cardSelected : styles.cardUnselected,
        pressed && styles.cardPressed
      ]}
    >
      {/* Selo de Selecionado */}
      {isSelected && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Adversário</Text>
        </View>
      )}

      {/* Foto do Bot com lógica de Fallback */}
      <View style={styles.imageContainer}>
        {imageError || !bot.foto ? (
          <Text style={styles.fallbackText}>Bot</Text>
        ) : (
          <Image 
            // Se bot.foto for um link web, usamos { uri: bot.foto }
            // Se for arquivo local, basta passar bot.foto (assumindo que seja um require)
            source={typeof bot.foto === 'string' ? { uri: bot.foto } : bot.foto} 
            style={styles.image}
            onError={() => setImageError(true)} // Muda o estado se der erro
          />
        )}
      </View>

      <Text style={styles.nameText} numberOfLines={1}>
        {bot.nome}
      </Text>
      
      <View style={styles.ratingContainer}>
        <Cpu size={14} color="#3b82f6" />
        <Text style={styles.ratingText}>{bot.rating} ELO</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 28,
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    position: 'relative', // Para o badge absoluto
  },
  cardUnselected: {
    backgroundColor: '#0f172a', // bg-slate-900
    borderColor: '#334155', // border-slate-700
  },
  cardSelected: {
    backgroundColor: '#1e293b', // bg-slate-800
    borderColor: '#88c425', // border-chess-green
    shadowColor: '#88c425', // shadow-[0_0_15px_rgba(136,196,37,0.3)]
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  badge: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#88c425',
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    borderRadius: 9999, // rounded-full
    zIndex: 10,
    elevation: 10,
  },
  badgeText: {
    color: '#0f172a',
    fontSize: 10, // text-[10px]
    fontWeight: '900', // font-black
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: 80, // w-20
    height: 80, // h-20
    borderRadius: 40, // rounded-full
    backgroundColor: '#334155', // bg-slate-700
    marginBottom: 16, // mb-4
    borderWidth: 1,
    borderColor: '#475569', // border-slate-600
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    color: '#64748b', // text-slate-500
    fontWeight: 'bold',
  },
  nameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18, // text-lg
    textAlign: 'center',
    marginBottom: 4, // mb-1
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
  ratingText: {
    color: '#3b82f6', // text-analysis-blue
    fontSize: 14, // text-sm
    fontWeight: '600', // font-semibold
  }
});

