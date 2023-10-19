const { spawn } = require('child_process');
const fs = require('fs');

// Nome do arquivo principal da sua aplicação
const mainFile = 'server.js';

// Função para iniciar a aplicação
function startApp() {
  const app = spawn('node', [mainFile], { stdio: 'inherit' });

  app.on('close', (code) => {
    if (code === 8) {
      console.error('Erro detectado, tentando reiniciar a aplicação...');
      setTimeout(startApp, 1000); // Tente reiniciar após 1 segundo
    }
  });
}

// Inicie a aplicação pela primeira vez
startApp();

// Observar por mudanças nos arquivos
fs.watchFile(mainFile, (curr, prev) => {
  console.log(`${mainFile} foi alterado. Reiniciando a aplicação...`);
  startApp();
});
