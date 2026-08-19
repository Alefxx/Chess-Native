// src/features/profile/ProfileView.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Pressable 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Pencil, Check } from 'lucide-react-native';

import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/apiClient';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';

// ==========================================
// ARQUITETURA MOBILE: Dicionário de Imagens
// ==========================================
// Como não temos a pasta 'public', mapeamos a string do banco para o asset local.
const AVATAR_MAP: Record<string, any> = {
  '/fotosperfil/perfil1.jpg': require('../../assets/fotosperfil/perfil1.jpg'),
  '/fotosperfil/perfil2.jpg': require('../../assets/fotosperfil/perfil2.jpg'),
  '/fotosperfil/perfil3.jpg': require('../../assets/fotosperfil/perfil3.jpg'),
  '/fotosperfil/perfil4.jpg': require('../../assets/fotosperfil/perfil4.jpg'),
  '/fotosperfil/perfil5.jpg': require('../../assets/fotosperfil/perfil5.jpg'),
  '/fotosperfil/perfil6.jpg': require('../../assets/fotosperfil/perfil6.jpg'),
  '/fotosperfil/perfil7.jpg': require('../../assets/fotosperfil/perfil7.jpg'),
  '/fotosperfil/perfil8.jpg': require('../../assets/fotosperfil/perfil8.jpg'),
};

export function ProfileView() {
  const navigation = useNavigation<any>();
  
  const user = useAuthStore((state) => state.user);
  const loginApp = useAuthStore((state) => state.login);

  const [nome, setNome] = useState(user?.nome || '');
  const [fotoSelecionada, setFotoSelecionada] = useState(user?.foto || '/fotosperfil/perfil1.jpg');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extrai as chaves do mapa para renderizar o grid
  const listaFotos = Object.keys(AVATAR_MAP);

  // Função auxiliar para resolver a imagem (seja local do mapa ou uma URL externa)
  const getAvatarSource = (path: string) => {
    return AVATAR_MAP[path] ? AVATAR_MAP[path] : { uri: path };
  };

  const handleSalvarAlteracoes = async () => {
    if (!nome.trim()) {
      setErrorMsg('O nome não pode ficar vazio.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');

      const response = await apiClient.put(`/perfil/${user?.username}`, {
        nome,
        foto: fotoSelecionada,
      });

      if (response.data.sucesso) {
        loginApp({
          ...user!,
          nome,
          foto: fotoSelecionada,
        });
        
        setIsEditingName(false);
        navigation.navigate('Dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.erro || 'Erro ao atualizar o perfil no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Permite clicar em botões mesmo com o teclado aberto
        >
          
          {/* Cabeçalho */}
          <View style={styles.header}>
            <IconButton 
              icon={<ArrowLeft size={24} color="#ffffff" />} 
              onPress={() => navigation.navigate('Dashboard')} // Substituído onClick por onPress
            />
            <Text style={styles.headerTitle}>Meu Perfil</Text>
          </View>

          {/* Área Central: Visualização e Edição */}
          <View style={styles.card}>
            
            {/* Foto de Perfil Atual */}
            <View style={styles.avatarHighlightContainer}>
              <Image 
                source={getAvatarSource(fotoSelecionada)} 
                style={styles.avatarHighlightImage} 
              />
            </View>

            {/* Campo de Nome */}
            <View style={styles.nameContainer}>
              <Text style={styles.nameLabel}>Nome do Jogador</Text>
              
              <View style={styles.inputRow}>
                {isEditingName ? (
                  <TextInput
                    value={nome}
                    onChangeText={setNome} // No mobile usamos onChangeText
                    style={styles.textInput}
                    autoFocus
                    placeholder="Digite seu nome"
                    placeholderTextColor="#64748b"
                  />
                ) : (
                  <Text style={styles.nameDisplay} numberOfLines={1}>
                    {nome}
                  </Text>
                )}
                
                <Pressable
                  onPress={() => setIsEditingName(!isEditingName)}
                  style={({ pressed }) => [
                    styles.editIconBtn,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  {isEditingName 
                    ? <Check size={20} color="#88c425" /> 
                    : <Pencil size={18} color="#94a3b8" />
                  }
                </Pressable>
              </View>
            </View>

            {/* Grade de Seleção de Avatares */}
            <View style={styles.gridSection}>
              <Text style={styles.gridLabel}>Escolha um novo Avatar</Text>
              
              <View style={styles.grid}>
                {listaFotos.map((path, index) => {
                  const isSelected = fotoSelecionada === path;
                  
                  return (
                    <Pressable
                      key={index}
                      onPress={() => setFotoSelecionada(path)}
                      style={({ pressed }) => [
                        styles.gridItem,
                        isSelected ? styles.gridItemSelected : styles.gridItemUnselected,
                        pressed && !isSelected && { transform: [{ scale: 0.95 }] }
                      ]}
                    >
                      <Image 
                        source={getAvatarSource(path)} 
                        style={styles.gridImage} 
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Exibição de Erros Técnicos */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Ação de Confirmação */}
            <View style={styles.actionContainer}>
              <Button 
                label={isLoading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} 
                onPress={handleSalvarAlteracoes} // Substituído onClick por onPress
                size="md"
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // bg-slate-950
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    width: '100%',
    maxWidth: 576, // max-w-xl
    marginBottom: 40, // mb-10
  },
  headerTitle: {
    fontSize: 24, // text-2xl
    fontWeight: '900', // font-black
    color: '#ffffff',
  },
  card: {
    width: '100%',
    maxWidth: 576,
    backgroundColor: '#1e293b', // bg-slate-800
    padding: 24, // p-6
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    alignItems: 'center',
    elevation: 10, // shadow-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  avatarHighlightContainer: {
    width: 128, // w-32
    height: 128, // h-32
    borderRadius: 64, // rounded-full
    backgroundColor: '#334155', // bg-slate-700
    borderWidth: 4,
    borderColor: '#88c425', // border-chess-green
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8, // shadow-lg
  },
  avatarHighlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // object-cover
  },
  nameContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 8, // gap-2
    marginBottom: 32,
  },
  nameLabel: {
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    color: '#94a3b8', // text-slate-400
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-wider
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a', // bg-slate-900
    padding: 12, // p-3
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
  },
  nameDisplay: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 0, // Zera o padding padrão do TextInput do Android
  },
  editIconBtn: {
    padding: 4,
  },
  gridSection: {
    width: '100%',
    gap: 12, // gap-3
    marginBottom: 32,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // Para RN mais novos. Se quebrar na sua versão, substitua por margins no gridItem
  },
  gridItem: {
    width: '22%', // ~4 itens por linha (simulando grid-cols-4)
    aspectRatio: 1, // Mantém quadrado
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0f172a', // bg-slate-900
    borderWidth: 2,
  },
  gridItemSelected: {
    borderColor: '#88c425', // border-chess-green
    transform: [{ scale: 1.05 }],
    elevation: 4, // shadow-md
  },
  gridItemUnselected: {
    borderColor: '#334155', // border-slate-700
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorBox: {
    width: '100%',
    padding: 12, // p-3
    backgroundColor: 'rgba(127, 29, 29, 0.5)', // bg-red-900/50
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fecaca',
    fontSize: 14,
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    paddingTop: 16, // pt-4
  }
});

