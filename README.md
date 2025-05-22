---

# Guia de Configuração e Execução do BusHere!

Este guia oferece as instruções necessárias para configurar e executar o projeto BusHere! em sua máquina local.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

* **Node.js**: Versão 18 ou superior.
* **npm**: Geralmente vem junto com o Node.js.

---

## Configuração Inicial

Para configurar o projeto, siga este passo:

1.  **Execute o Script de Setup**:
    Este script instalará todas as dependências necessárias na raiz e nas pastas `web` e `server`, além de copiar os arquivos de ambiente (`.env.example` para `.env`) para cada projeto.
    ```bash
    npm run setup
    ```

---

## Executando os Projetos

Após a configuração, você pode iniciar os projetos `web` e `server` simultaneamente:

Para rodar ambos os projetos, execute:
```bash
npm start
```

Este comando utilizará o `concurrently` para iniciar o frontend (`web`) e o backend (`server`) ao mesmo tempo, e então abrirá automaticamente o navegador na URL do frontend.

---

Se tiver qualquer dúvida ou encontrar algum problema, não hesite em entrar em contato!