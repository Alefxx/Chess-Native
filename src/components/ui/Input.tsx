// src/components/ui/Input.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string; 
  icon?: React.ReactNode;
}

export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon
}: InputProps) {
  // Estado para controlar se o teclado está ativo neste input
  const [isFocused, setIsFocused] = useState(false);

  // Mapeamento do tipo de input para o teclado do celular
  const getKeyboardType = () => {
    if (type === 'email') return 'email-address';
    if (type === 'number') return 'numeric';
    return 'default';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputWrapper}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChange} // No RN, onChangeText já entrega a string direta
          placeholder={placeholder}
          placeholderTextColor="#64748b" // placeholder:text-slate-500
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password'} // Esconde a senha
          autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
          autoCorrect={type !== 'password'}
          textContentType={type === 'password' ? 'password' : type === 'email' ? 'emailAddress' : undefined}
          accessibilityLabel={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            icon ? { paddingLeft: 40 } : { paddingLeft: 16 }, // pl-10 : pl-4
            isFocused && !error ? styles.inputFocused : null,
            error ? styles.inputError : null
          ]}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 6 }, // gap-1.5
  label: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#94a3b8', // text-slate-400
    marginLeft: 4, // ml-1
  },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  iconContainer: {
    position: 'absolute',
    left: 12, // left-3
    zIndex: 10,
    elevation: 10, // Garante que o ícone fique acima do input no Android
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a', // bg-slate-900
    borderWidth: 2,
    borderColor: '#334155', // border-slate-700
    borderRadius: 8, // rounded-lg
    minHeight: 50,
    paddingVertical: 12,
    paddingRight: 16,
    color: '#ffffff', // text-white
    fontSize: 16, // md:text-base (melhor padrão para mobile)
  },
  inputFocused: {
    borderColor: '#88c425', // focus:border-chess-green
    // Sombra simulando o anel de foco
    shadowColor: '#88c425',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ef4444', // border-red-500
  },
  errorText: {
    fontSize: 12, // text-xs
    color: '#ef4444', // text-red-500
    marginLeft: 4, // ml-1
    fontWeight: '500',
  }
});

