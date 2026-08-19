// src/features/auth/view/RegisterView.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native'; // Atualizado para a versão nativa
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo';
import { authService } from '../service/auth.service';
import { useAuthStore } from '@/store/authStore';

export function RegisterView() {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigation = useNavigation<any>();
  const loginApp = useAuthStore((state) => state.login);

  const handleRegister = async () => {
    if (!nome || !username || !senha) {
      setErrorMsg('Preencha Nome, Usuário e Senha.');
      return;
    }

    if (senha !== confirmSenha) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      
      await authService.register({ nome, username, senha });
      const loginResponse = await authService.login({ username, senha });
      
      if (loginResponse.sucesso && loginResponse.perfil) {
        loginApp(loginResponse.perfil);
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('Login');
      }

    } catch (error: any) {
      const mensagemErro = error.response?.data?.erro || error.response?.data?.message || 'Erro ao criar conta. O usuário pode já existir.';
      setErrorMsg(mensagemErro);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Logo size="lg" />
            <Text style={styles.subtitle}>
              Grandmaster Analysis Engine
            </Text>
          </View>

          <Card>
            {/* Header Interno do Card */}
            <View style={styles.cardHeader}>
              <View style={styles.backButtonWrapper}>
                <IconButton 
                  icon={<ArrowLeft size={20} color="#cbd5e1" />} 
                  onPress={() => navigation.navigate('Login')} // Volta pro Login
                  variant="ghost"
                />
              </View>
              <Text style={styles.title}>Novo Jogador</Text>
            </View>
            
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}
            
            <View style={styles.formContainer}>
              <Input label="Nome Completo" value={nome} onChange={setNome} placeholder="Ex: Thayná Silva" />
              <Input label="Nome de Usuário (Username)" value={username} onChange={setUsername} placeholder="Ex: thayna_dev" />
              <Input label="Senha" type="password" value={senha} onChange={setSenha} placeholder="Crie uma senha forte" />
              <Input label="Confirmar Senha" type="password" value={confirmSenha} onChange={setConfirmSenha} placeholder="Repita a senha" />
            </View>

            <View style={styles.actionContainer}>
              <Button 
                label={isLoading ? 'Criando e Autenticando...' : 'Cadastrar e Jogar'} 
                onPress={handleRegister} 
              />
            </View>
          </Card>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingVertical: 32, // Dá um respiro extra em telas menores com o teclado aberto
  },
  header: { alignItems: 'center', marginBottom: 32 },
  subtitle: {
    color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginTop: 12,
  },
  cardHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24, // mb-6
  },
  backButtonWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#ffffff',
  },
  errorBox: {
    marginBottom: 16, padding: 12, backgroundColor: 'rgba(127, 29, 29, 0.5)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4, alignItems: 'center',
  },
  errorText: { color: '#fecaca', fontSize: 14, textAlign: 'center' },
  formContainer: { gap: 16, marginBottom: 32 },
  actionContainer: { gap: 12 },
});

