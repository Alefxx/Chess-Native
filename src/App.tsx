// App.tsx
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Rotas
import { AppRoutes } from './src/routes/AppRoutes';

// Serviços Injetados (Bridge)
import { engineService } from './src/features/bot/service/engine.service';
import { analysisService } from './src/features/stockfish/analysis/service/analysis.service';

export default function App() {
  const webviewRef = useRef<WebView>(null);

  /**
   * Recebe os cálculos da Engine JS de dentro do WebView e distribui 
   * para os nossos serviços de lógica de negócio nativos.
   */
  const handleEngineMessage = (event: any) => {
    const output = event.nativeEvent.data;
    // O tráfego é roteado para ambos. Cada serviço lida com a string 
    // dependendo de qual deles solicitou a jogada.
    engineService.receiveMessageFromEngine(output);
    analysisService.receiveMessageFromEngine(output);
  };

  /**
   * Assim que o WebView termina de carregar, nós injetamos a capacidade 
   * de envio de comandos UCI para dentro dele.
   */
  const handleWebViewLoad = () => {
    // Cria a função injetora de Javascript
    const sendMessage = (msg: string) => {
      webviewRef.current?.injectJavaScript(`
        if (typeof stockfish !== 'undefined') {
          stockfish.postMessage('${msg}');
        }
        true;
      `);
    };

    // Acopla a função nos serviços do app
    engineService.sendMessageToEngine = sendMessage;
    analysisService.sendMessageToEngine = sendMessage;

    // Dá a ignição inicial no motor
    engineService.initEngine();
  };

  /**
   * Template HTML mínimo para carregar o Worker no Mobile.
   * DICA: No Expo, a forma mais estável de usar o stockfish.js é hospedar o arquivo
   * minificado em um CDN próprio ou Github Pages e colocar a URL no <script src="...">.
   */
  const stockfishHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          // Intercepta a saída do Stockfish e manda para o React Native
          var stockfish = new Worker('https://sua-url-hospedada.com/stockfish.js');
          
          stockfish.onmessage = function(event) {
            window.ReactNativeWebView.postMessage(event.data);
          };
        </script>
      </head>
      <body></body>
    </html>
  `;

  return (
    <SafeAreaProvider style={{ backgroundColor: '#020617' }}>
      {/* Controla a cor dos ícones de bateria/wi-fi do celular (light = ícones brancos) */}
      <StatusBar style="light" backgroundColor="#020617" />
      
      {/* Todo o sistema de roteamento e telas que construímos */}
      <AppRoutes />

      {/* O Motor de Xadrez rodando de forma isolada e invisível */}
      <WebView
        ref={webviewRef}
        source={{ html: stockfishHtml }}
        onMessage={handleEngineMessage}
        onLoadEnd={handleWebViewLoad}
        style={{ width: 0, height: 0, opacity: 0 }} 
        javaScriptEnabled={true}
        originWhitelist={['*']}
      />
    </SafeAreaProvider>
  );
}


