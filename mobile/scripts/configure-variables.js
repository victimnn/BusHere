const readline = require('readline');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

// Função para perguntar algo ao usuário
function awaitInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  let sdkPath = await awaitInput('Digite o caminho do Android SDK (deixe vazio para usar o padrão): ');
  if (!sdkPath) {
    sdkPath = path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk');
  }
  console.log('Caminho do Android SDK:', sdkPath);
  // Comando para definir a variável de ambiente do usuário no Windows
  const setxCmd = `setx ANDROID_HOME "${sdkPath}"`;
  exec(setxCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao definir ANDROID_HOME:', error);
    } else {
      console.log('ANDROID_HOME configurado para:', sdkPath);
      exec('echo %ANDROID_HOME%', (err, stdout) => {
        if (err) {
          console.error('Erro ao ler ANDROID_HOME do sistema:', err);
        } else {
          console.log('ANDROID_HOME (cmd):', stdout.trim());
        }
      });
    }
  });
}

main();