/**
 * Estrutura de dados baseada no banco de dados
 * 
 * O BusCard deve exibir informações da rota do passageiro logado,
 * incluindo dados de:
 * - Rotas (informações da rota)
 * - PontosRota (pontos e horários da rota)
 * - VeiculoRota (veículo e motorista da rota)
 * - Pontos (ponto específico do passageiro)
 */

// Mock data estruturado conforme o banco de dados
export const routesData = [
    {
        // Dados da tabela Rotas
        rota_id: 1,
        codigo_rota: "R001",
        nome: "Rota Centro - ETEC",
        descricao: "Rota principal centro da cidade até ETEC João Belarmino",
        origem_descricao: "Terminal Central",
        destino_descricao: "ETEC João Belarmino",
        distancia_km: 15.5,
        tempo_viagem_estimado_minutos: 45,
        status_rota_id: 1, // Ativa
        
        // Dados da tabela VeiculoRota (veículo atual da rota)
        veiculo: {
            veiculo_rota_id: 1,
            veiculo: {
                veiculo_id: 1,
                nome: "Giraldi 2246",
                placa: "ABC-1234",
                modelo: "Mercedes-Benz OF-1722",
                capacidade: 45
            },
            motorista: {
                motorista_id: 1,
                nome: "João Silva"
            }
        },
        
        // Dados da tabela PontosRota (pontos da rota em ordem)
        pontos_rota: [
            {
                ponto_rota_id: 1,
                ordem: 1,
                horario_previsto_passagem: "05:45:00",
                ponto: {
                    ponto_id: 1,
                    nome: "Terminal Central",
                    logradouro: "Av. Zeus",
                    numero_endereco: "100",
                    bairro: "Centro"
                }
            },
            {
                ponto_rota_id: 2,
                ordem: 2,
                horario_previsto_passagem: "06:15:00",
                ponto: {
                    ponto_id: 2,
                    nome: "ETEC João Belarmino",
                    logradouro: "Rua das Escolas",
                    numero_endereco: "500",
                    bairro: "Educacional"
                }
            }
        ],
        
        // Status atual da rota (calculado em tempo real)
        status_atual: "EM TEMPO",
        proximo_horario: "05:45",
        
        // Ponto específico do passageiro (da tabela Passageiros)
        ponto_passageiro: {
            ponto_id: 1,
            nome: "Terminal Central",
            horario_previsto: "05:45"
        }
    }
];

// Dados do passageiro (exemplo)
export const passageiroData = {
    passageiro_id: 1,
    nome_completo: "Ana Silva",
    rota_id: 1, // Rota principal do passageiro
    ponto_id: 1, // Ponto onde o passageiro embarca
    // ... outros campos
};

// Função para buscar dados da rota do passageiro
export const getPassengerRoute = (passageiroId) => {
    // Em produção, isso seria uma consulta ao banco:
    // SELECT r.*, vr.*, v.*, m.*, pr.*, p.*
    // FROM Passageiros pass
    // INNER JOIN Rotas r ON pass.rota_id = r.rota_id
    // INNER JOIN VeiculoRota vr ON r.rota_id = vr.rota_id
    // INNER JOIN Veiculos v ON vr.veiculo_id = v.veiculo_id
    // INNER JOIN Motoristas m ON vr.motorista_id = m.motorista_id
    // INNER JOIN PontosRota pr ON r.rota_id = pr.rota_id
    // INNER JOIN Pontos p ON pr.ponto_id = p.ponto_id
    // WHERE pass.passageiro_id = ? AND pass.ativo = true
    // ORDER BY pr.ordem
    
    return routesData.find(route => route.rota_id === passageiroData.rota_id);
};

// Função para formatar dados para o BusCard
export const formatRouteForBusCard = (routeData) => {
    const pontoPassageiro = routeData.pontos_rota.find(
        pr => pr.ponto.ponto_id === routeData.ponto_passageiro.ponto_id
    );
    
    return {
        id: routeData.rota_id,
        name: routeData.veiculo.veiculo.nome, // Nome do veículo
        route: `${routeData.origem_descricao} para ${routeData.destino_descricao}`,
        time: pontoPassageiro?.horario_previsto_passagem.substring(0, 5) || routeData.proximo_horario,
        status: routeData.status_atual,
        codigo_rota: routeData.codigo_rota,
        ponto_embarque: routeData.ponto_passageiro.nome,
        distancia_km: routeData.distancia_km,
        tempo_estimado: routeData.tempo_viagem_estimado_minutos,
        motorista: routeData.veiculo.motorista.nome,
        capacidade: routeData.veiculo.veiculo.capacidade
    };
};