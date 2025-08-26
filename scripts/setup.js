/* Script para fazer o setup do projeto, aqui está o setup antigo:
echo Instalando dependências na raiz...
npm install

echo.
echo Iniciando o setup global...

echo.
echo Copiando .env.example para .env nas pastas de projeto...
copy .\web\.env.example .\web\.env
echo .\web\.env copiado.
copy .\server\.env.example .\server\.env
echo .\server\.env copiado.

echo Instalando dependências do web...
cd web
npm install
cd ..

echo.
echo Executando setup do servidor...
cd server
npm install
npm run setup
cd ..

echo.
echo Executando setup do webapp...
cd webapp
npm install
npm run setup
cd ..

echo.
echo Setup global concluído com sucesso!
*/

import { input, checkbox } from '@inquirer/prompts';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const tasks = [
    {
        name: "Instalar dependências do projeto",
        command: "npm install",
        checked: true
    },
    {
        name: "Copiar arquivos de configuração",
        command: "copy .\\web\\.env.example .\\web\\.env && copy .\\server\\.env.example .\\server\\.env",
        checked: true
    },
    {
        name: "Executar setup do Web",
        command: "cd web && npm install && npm run setup && cd ..",
        checked: false
    },
    {
        name: "Executar setup do servidor",
        command: "cd server && npm install && npm run setup && cd ..",
        checked: false
    },
    {
        name: "Executar setup do webapp",
        command: "cd webapp && npm install && npm run setup && cd ..",
        checked: false
    }
];

const taskOptions = tasks.map((task, index) => ({
    name: task.name,
    value: task.command,
    checked: true
}));



const answer = await checkbox({
    message: "Quais tarefas de setup você deseja executar?",
    choices: taskOptions,
    required: true,
    loop: true,
});

const execAsync = promisify(exec);
for (const cmd of answer) {
    console.log(`\nExecutando: ${cmd}`);
    try {
        const { stdout, stderr } = await execAsync(cmd);
        if (stdout) console.log(chalk.gray(stdout));
        if (stderr) console.error(chalk.red(stderr));
    } catch (err) {
        console.error(`Erro ao executar "${cmd}":`, err);
        break;
    }
}

console.log(chalk.green.bold("\n SETUP CONCLUÍDO COM SUCESSO!"));

