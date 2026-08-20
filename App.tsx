// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

import { AppRoutes } from './src/routes/AppRoutes';
import { engineService } from './src/features/bot/service/engine.service';
import { analysisService } from './src/features/stockfish/analysis/service/analysis.service';

export default function App() {
  const botWebViewRef = useRef<WebView>(null);
  const analysisWebViewRef = useRef<WebView>(null);

  const handleBotMessage = (event: any) => {
    engineService.receiveMessageFromEngine(event.nativeEvent.data);
  };

  const handleBotLoad = () => {
    engineService.sendMessageToEngine = (msg: string) => {
      botWebViewRef.current?.injectJavaScript(`if (typeof stockfish !== 'undefined') { stockfish.postMessage('${msg}'); } true;`);
    };
    engineService.initEngine();
  };

  const handleAnalysisMessage = (event: any) => {
    analysisService.receiveMessageFromEngine(event.nativeEvent.data);
  };

  const handleAnalysisLoad = () => {
    analysisService.sendMessageToEngine = (msg: string) => {
      analysisWebViewRef.current?.injectJavaScript(`if (typeof stockfish !== 'undefined') { stockfish.postMessage('${msg}'); } true;`);
    };
  };

  const stockfishHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          async function initStockfish() {
            try {
              const response = await fetch('https://unpkg.com/stockfish.js@10.0.2/stockfish.js');
              const scriptText = await response.text();
              const blob = new Blob([scriptText], { type: 'application/javascript' });
              const blobUrl = URL.createObjectURL(blob);
              
              window.stockfish = new Worker(blobUrl);
              window.stockfish.onmessage = function(event) {
                window.ReactNativeWebView.postMessage(event.data);
              };
              
              window.ReactNativeWebView.postMessage('uciok');
            } catch (e) {
              window.ReactNativeWebView.postMessage('ERRO: ' + e.message);
            }
          }
          initStockfish();
        </script>
      </head>
      <body></body>
    </html>
  `;

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
          source={{ html: stockfishHtml }}
          onMessage={handleBotMessage}
          onLoadEnd={handleBotLoad}
          style={styles.webview} 
          javaScriptEnabled={true}
          // Garante que o fundo do navegador nativo seja transparente
          style={{ backgroundColor: 'transparent' }} 
        />

        <WebView
          ref={analysisWebViewRef}
          source={{ html: stockfishHtml }}
          onMessage={handleAnalysisMessage}
          onLoadEnd={handleAnalysisLoad}
          style={styles.webview} 
          javaScriptEnabled={true}
          style={{ backgroundColor: 'transparent' }}
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

