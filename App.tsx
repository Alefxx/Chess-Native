// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { AppRoutes } from './src/routes/AppRoutes';
import { engineService } from './src/features/bot/service/engine.service';
import { analysisService } from './src/features/stockfish/analysis/service/analysis.service';

export default function App() {
  const webviewRef = useRef<WebView>(null);

  const handleEngineMessage = (event: any) => {
    const output = event.nativeEvent.data;
    
    // DEBUG: Descomente a linha abaixo para ver a IA "pensando" no seu terminal
    // console.log('[STOCKFISH]:', output);
    
    engineService.receiveMessageFromEngine(output);
    analysisService.receiveMessageFromEngine(output);
  };

  const handleWebViewLoad = () => {
    console.log('[SISTEMA]: WebView carregou. Injetando comandos...');

    const sendMessage = (msg: string) => {
      webviewRef.current?.injectJavaScript(`
        if (typeof stockfish !== 'undefined') {
          stockfish.postMessage('${msg}');
        }
        true;
      `);
    };

    engineService.sendMessageToEngine = sendMessage;
    analysisService.sendMessageToEngine = sendMessage;
    engineService.initEngine();
  };

  // HTML injetado com um link real e funcional para testes
  const stockfishHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          try {
            // Usando um CDN público para testar o Stockfish puramente em JS
            var stockfish = new Worker('https://unpkg.com/stockfish.js@10.0.2/stockfish.js');
            
            stockfish.onmessage = function(event) {
              window.ReactNativeWebView.postMessage(event.data);
            };
            
            // Avisa o React Native que o script iniciou
            window.ReactNativeWebView.postMessage('WORKER_INICIADO');
          } catch (e) {
            window.ReactNativeWebView.postMessage('ERRO_NO_WORKER: ' + e.message);
          }
        </script>
      </head>
      <body></body>
    </html>
  `;

  return (
    <SafeAreaProvider style={{ backgroundColor: '#020617' }}>
      <StatusBar style="light" backgroundColor="#020617" />
      
      <AppRoutes />

      <WebView
        ref={webviewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleEngineMessage}
        onLoadEnd={handleWebViewLoad}
        // DEBUG: Se a tela ficar em branco, mude opacity para 1 e zIndex para 100 para ver se o WebView está quebrando
        style={{ width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
        originWhitelist={['*']}
      />
    </SafeAreaProvider>
  );
}