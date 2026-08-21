// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

import { AppRoutes } from './src/routes/AppRoutes';
import { engineService } from './src/features/stockfish/bot/service/engine.service';
import { analysisService } from './src/features/stockfish/analysis/service/analysis.service';

export default function App() {
  const botWebViewRef = useRef<WebView>(null);
  const analysisWebViewRef = useRef<WebView>(null);

  const handleBotMessage = (event: any) => {
    console.log("🤖 [BOT DISSE]:", event.nativeEvent.data);
    engineService.receiveMessageFromEngine(event.nativeEvent.data);
  };

  const handleBotLoad = () => {
    console.log("🌐 [WEBVIEW BOT]: Página do Netlify carregada!");
    engineService.sendMessageToEngine = (msg: string) => {
      // Agora o envio é direto e limpo usando postMessage nativo
      botWebViewRef.current?.postMessage(msg);
    };
    engineService.initEngine();
  };

  const handleAnalysisMessage = (event: any) => {
    console.log("🔎 [ANALYSIS DISSE]:", event.nativeEvent.data);
    analysisService.receiveMessageFromEngine(event.nativeEvent.data);
  };

  const handleAnalysisLoad = () => {
    console.log("🌐 [WEBVIEW ANALYSIS]: Página do Netlify carregada!");
    analysisService.sendMessageToEngine = (msg: string) => {
      analysisWebViewRef.current?.postMessage(msg);
    };
  };

  return (
    <SafeAreaProvider style={styles.root} initialMetrics={initialWindowMetrics}> 
      <StatusBar style="light" /> 
      
      {/* Container principal do aplicativo */}
      <View style={styles.container}>
        <AppRoutes />
      </View>

      {/* JAULA OFF-SCREEN: Joga os WebViews para fora da tela e anula cliques */}
      <View style={styles.offScreenCage} pointerEvents="none">
        <WebView
          ref={botWebViewRef}
          source={{ uri: 'https://webfishh.netlify.app/' }}
          onMessage={handleBotMessage}
          onLoadEnd={handleBotLoad}
          javaScriptEnabled={true}
          style={[styles.webview, { backgroundColor: 'transparent' }]} 
        />

        <WebView
          ref={analysisWebViewRef}
          source={{ uri: 'https://webfishh.netlify.app/' }}
          onMessage={handleAnalysisMessage}
          onLoadEnd={handleAnalysisLoad}
          javaScriptEnabled={true}
          style={[styles.webview, { backgroundColor: 'transparent' }]}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
  },
  offScreenCage: {
    position: 'absolute',
    top: -9999, // Joga pra quilômetros acima do topo do celular
    left: -9999, // Joga pra quilômetros à esquerda
    width: 10,   // Tamanho não-zero pro Android não "dormir" a tab
    height: 10,
    zIndex: -99, // Fica atrás de tudo
    overflow: 'hidden',
    opacity: 0,
  },
  webview: {
    width: 10,
    height: 10,
  }
});
