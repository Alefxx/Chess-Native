// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar'; // <-- Certifique-se de que o import vem do Expo
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
    <SafeAreaProvider style={{ backgroundColor: '#020617' }}>
      {/* Removido o backgroundColor problemático. style="light" deixa o relógio e bateria brancos */}
      <StatusBar style="light" /> 
      
      <AppRoutes />

      <WebView
        ref={botWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleBotMessage}
        onLoadEnd={handleBotLoad}
        style={{ width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
      />

      <WebView
        ref={analysisWebViewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleAnalysisMessage}
        onLoadEnd={handleAnalysisLoad}
        style={{ width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
      />
    </SafeAreaProvider>
  );
}