// src/features/profile/ProfileView.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Pressable 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Pencil, Check } from 'lucide-react-native';

import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/apiClient';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ScreenLayout } from '@/components/layout/ScreenLayout'; // <-- Import do nosso Layout Profissional!

// ==========================================
// ARQUITETURA MOBILE: Dicionário de Imagens
// ==========================================
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

  const listaFotos = Object.keys(AVATAR_MAP);

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
    // Substituímos o SafeAreaView e o KeyboardAvoidingView nativos pelo nosso componente
    <ScreenLayout noPadding>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <IconButton 
            icon={<ArrowLeft size={24} color="#ffffff" />} 
            onPress={() => navigation.navigate('Dashboard')} 
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
                  onChangeText={setNome} 
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
              onPress={handleSalvarAlteracoes} 
              size="md"
            />
          </View>

        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Removido styles.safeArea e styles.keyboardView
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1, // Isso garante que o conteúdo estique até o final se a tela for muito grande
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, 
    width: '100%',
    maxWidth: 576, 
    marginBottom: 40, 
  },
  headerTitle: {
    fontSize: 24, 
    fontWeight: '900', 
    color: '#ffffff',
  },
  card: {
    width: '100%',
    maxWidth: 576,
    backgroundColor: '#1e293b', 
    padding: 24, 
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#334155', 
    alignItems: 'center',
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  avatarHighlightContainer: {
    width: 128, 
    height: 128, 
    borderRadius: 64, 
    backgroundColor: '#334155', 
    borderWidth: 4,
    borderColor: '#88c425', 
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8, 
  },
  avatarHighlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  nameContainer: {
    width: '100%',
    maxWidth: 384, 
    gap: 8, 
    marginBottom: 32,
  },
  nameLabel: {
    fontSize: 12, 
    fontWeight: 'bold',
    color: '#94a3b8', 
    textTransform: 'uppercase',
    letterSpacing: 1, 
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a', 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: '#334155', 
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
    padding: 0, 
  },
  editIconBtn: {
    padding: 4,
  },
  gridSection: {
    width: '100%',
    gap: 12, 
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
    gap: 12, 
  },
  gridItem: {
    width: '22%', 
    aspectRatio: 1, 
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0f172a', 
    borderWidth: 2,
  },
  gridItemSelected: {
    borderColor: '#88c425', 
    transform: [{ scale: 1.05 }],
    elevation: 4, 
  },
  gridItemUnselected: {
    borderColor: '#334155', 
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorBox: {
    width: '100%',
    padding: 12, 
    backgroundColor: 'rgba(127, 29, 29, 0.5)', 
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
    paddingTop: 16, 
  }
});
