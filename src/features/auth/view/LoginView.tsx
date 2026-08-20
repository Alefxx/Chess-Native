// src/features/auth/view/LoginView.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { authService } from '../service/auth.service';
import { useAuthStore } from '@/store/authStore';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

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
        // O Zustand atualiza o estado e o AppRoutes muda a tela automaticamente!
        loginApp(response.perfil); 
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
    <ScreenLayout noPadding>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" 
      >
        
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
            <Text 
              style={styles.linkText} 
              onPress={() => navigation.navigate('Register')}
            >
              Cadastre-se aqui
            </Text>
          </View>
        </Card>

      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    color: '#64748b', 
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 4, 
    marginTop: 12,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24, 
  },
  errorBox: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(127, 29, 29, 0.5)', 
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  errorText: {
    color: '#fecaca', 
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16, 
    marginBottom: 32, 
  },
  actionContainer: {
    gap: 12, 
  },
  footer: {
    marginTop: 24, 
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8', 
  },
  linkText: {
    fontSize: 14,
    color: '#38bdf8', 
    fontWeight: '600',
  }
});
