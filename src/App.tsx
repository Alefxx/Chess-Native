// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

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
    // 1. ADICIONADO: flex: 1 para a raiz do app preencher a tela toda
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#020617' }}> 
      <StatusBar style="light" /> 
      
      <AppRoutes />

      {/* 2. ADICIONADO: position: 'absolute' para o WebView sair do fluxo visual */}
      <WebView
        ref={botWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleBotMessage}
        onLoadEnd={handleBotLoad}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
      />

      {/* 2. ADICIONADO: position: 'absolute' no segundo WebView também! */}
      <WebView
        ref={analysisWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleAnalysisMessage}
        onLoadEnd={handleAnalysisLoad}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
      />
    </SafeAreaProvider>
  );
}




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
              window.stockfish.onmessage = function(event) { window.ReactNativeWebView.postMessage(event.data); };
              window.ReactNativeWebView.postMessage('uciok');
            } catch (e) { window.ReactNativeWebView.postMessage('ERRO: ' + e.message); }
          }
          initStockfish();
        </script>
      </head>
      <body></body>
    </html>
  `;

  return (
    // initialWindowMetrics resolve problemas de tamanho inicial no Android
    <SafeAreaProvider style={styles.root} initialMetrics={initialWindowMetrics}> 
      <StatusBar style="light" /> 
      
      <View style={styles.container}>
        <AppRoutes />
      </View>

      <WebView
        ref={botWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleBotMessage}
        onLoadEnd={handleBotLoad}
        style={styles.webview} 
        javaScriptEnabled={true}
      />
      <WebView
        ref={analysisWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleAnalysisMessage}
        onLoadEnd={handleAnalysisLoad}
        style={styles.webview} 
        javaScriptEnabled={true}
      />
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
  webview: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  }
});

