// src/features/auth/view/LoginView.tsx
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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { authService } from '../service/auth.service';
import { useAuthStore } from '@/store/authStore';

export function LoginView() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigation = useNavigation<any>();
  const loginApp = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!username || !senha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      
      const response = await authService.login({ username, senha });
      
      if (response.sucesso && response.perfil) {
        loginApp(response.perfil); 
        navigation.navigate('Dashboard'); // Atualizado para navegação nativa
      } else {
        setErrorMsg(response.erro || 'Erro ao realizar login.');
      }
    } catch (error: any) {
      const mensagemBackend = error.response?.data?.erro || 'Não foi possível conectar ao servidor.';
      setErrorMsg(mensagemBackend);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView empurra a tela para cima quando o teclado abre
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Clicar fora dos inputs fecha o teclado */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Logo size="lg" />
            <Text style={styles.subtitle}>
              Grandmaster Analysis Engine
            </Text>
          </View>

          <Card>
            <Text style={styles.title}>Acesso ao Sistema</Text>
            
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <Input 
                label="Nome de Usuário" 
                value={username} 
                onChange={setUsername} 
                placeholder="Seu usuário (ex: thayna_dev)"
              />
              <Input 
                label="Senha" 
                type="password" 
                value={senha} 
                onChange={setSenha}
                placeholder="Sua senha secreta"
              />
            </View>

            <View style={styles.actionContainer}>
              <Button 
                label={isLoading ? 'Autenticando...' : 'Entrar'} 
                onPress={handleLogin} 
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta? </Text>
              {/* O Link virou um Text com onPress */}
              <Text 
                style={styles.linkText} 
                onPress={() => navigation.navigate('Register')}
              >
                Cadastre-se aqui
              </Text>
            </View>
          </Card>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Presumindo um fundo escuro geral para a tela
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    color: '#64748b', // text-slate-500
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 4, // tracking-[0.4em]
    marginTop: 12,
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24, // mb-6
  },
  errorBox: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(127, 29, 29, 0.5)', // bg-red-900/50
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  errorText: {
    color: '#fecaca', // text-red-200
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16, // flex gap-4
    marginBottom: 32, // mb-8
  },
  actionContainer: {
    gap: 12, // gap-3
  },
  footer: {
    marginTop: 24, // mt-6
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8', // text-slate-400
  },
  linkText: {
    fontSize: 14,
    color: '#38bdf8', // text-analysis-blue
    fontWeight: '600',
  }
});

