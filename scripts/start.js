// Script para rodar o projeto, escolhendo quais partes do monorepo iniciar
import { input, checkbox } from '@inquirer/prompts';
import { exec } from 'child_process';
import concurrently from 'concurrently';
import chalk from 'chalk';

const services = [
    { name: "Web",    command: "npm run start --prefix web",   color: "blue", tag:"W" },
    { name: "Server", command: "npm run start --prefix server", color: "green", tag:"S" },
    { name: "WebApp", command: "npm run start --prefix webapp", color: "yellow", tag:"WA" },
    { name: "Mobile", command: "npm run start --prefix mobile", color: "red", tag:"M" }
    //{ name: "Abrir Navegador"}
]

const checkboxOptions = services.map(service => ({
    name: service.name,
    value: {
        command: service.command,
        prefixColor: service.color,
        name: service.tag
    }
}));

const answer = await checkbox({
    message: "Quais serviços você deseja iniciar?",
    choices: checkboxOptions,
    required: true,
    loop: true,
});

const result = concurrently(answer);

/*
try {
  await result.result;
  console.log(chalk.green.bold('Todos os serviços iniciados!'));
} catch (err) {
  console.error(chalk.red('Erro ao iniciar serviços:'), err);
}
*/