// src/components/ui/UserProfileWidget.tsx
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

interface UserProfileWidgetProps {
  nome: string;
  rating: number;
  iniciais: string;
  foto?: string; 
  onPress?: () => void; // onClick vira onPress
}

export function UserProfileWidget({ nome, rating, iniciais, foto, onPress }: UserProfileWidgetProps) {
  
  return (
    <Pressable
      onPress={onPress} 
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Abrir perfil de ${nome}` : undefined}
      style={({ pressed }) => [
        styles.container,
        onPress && styles.interactiveContainer,
        pressed && styles.pressed
      ]}
    >
      {/* Informações de Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.nameText} numberOfLines={1}>{nome}</Text>
        <Text style={styles.ratingText}>{rating} ELO</Text>
      </View>
      
      {/* Círculo do Avatar */}
      <View style={styles.avatarContainer}>
        {foto ? (
          <Image 
            // Aceita tanto URL externa ({uri: ...}) quanto require() local
            source={typeof foto === 'string' ? { uri: foto } : foto} 
            style={styles.image} 
          />
        ) : (
          <Text style={styles.initials}>{iniciais}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
    paddingVertical: 8, // p-2
    paddingLeft: 8,
    paddingRight: 16, // pr-4
    borderRadius: 9999, // rounded-full
    borderWidth: 1,
    borderColor: 'transparent',
  },
  interactiveContainer: {
    // hover:border-slate-700
    borderColor: '#334155', 
  },
  pressed: {
    // hover:bg-slate-800
    backgroundColor: '#1e293b', 
  },
  textContainer: {
    alignItems: 'flex-end', // text-right
    flexShrink: 1, // Impede que nomes gigantes quebrem o layout da tela
  },
  nameText: {
    fontSize: 14, // text-sm
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ratingText: {
    fontSize: 12, // text-xs
    color: '#3b82f6', // text-analysis-blue
    fontWeight: 'bold',
    letterSpacing: 1, // tracking-wider
  },
  avatarContainer: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20,
    backgroundColor: '#334155', // bg-slate-700
    borderWidth: 2,
    borderColor: '#88c425', // border-chess-green
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 4, // shadow-lg
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#cbd5e1', // text-slate-300
    fontWeight: 'bold',
    fontSize: 14,
  }
});

