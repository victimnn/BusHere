import { useVehicles } from '../../../hooks/data/useVehicles';
// Função para transformar dados da API (routeRoutes) no formato do BusCard
const transformRouteApiToBusCard = (route, vehicles) => {
    if (!route || !route.stops || !Array.isArray(route.stops)) return [];
    // Ida
    const origem = route.stops.find(s => s.ponto_id === route.userStop) || route.stops[0] || {};
    const destino = route.stops[route.stops.length - 1] || {};
    const veiculo = vehicles && vehicles.length > 0 ? vehicles[0] : {};
    const time = origem.horario_previsto_passagem || origem.horario || '';
    const ida = {
        id: route.rota_id,
        name: veiculo.nome || 'Veículo',
        route: `${origem.nome || route.origem_descricao} para ${destino.nome || route.destino_descricao}`,
        time,
        status: route.ativo === 1 ? 'ATIVA' : 'INATIVA',
        codigo_rota: route.codigo_rota,
        ponto_embarque: origem.nome,
        distancia_km: route.distancia_km,
        tempo_estimado: route.tempo_viagem_estimado_minutos,
        motorista: 'LOREM IPSUM',
        capacidade: veiculo.capacidade || '',
    };
    // Volta (inverte stops, horário '--/--')
    const stopsReversed = [...route.stops].reverse();
    const origemVolta = stopsReversed[0] || {};
    const destinoVolta = stopsReversed[stopsReversed.length - 1] || {};
    const volta = {
        id: route.rota_id + '_volta',
        name: veiculo.nome || 'Veículo',
        route: `${origemVolta.nome || route.destino_descricao} para ${destinoVolta.nome || route.origem_descricao}`,
        time: '--/--',
        status: ida.status,
        codigo_rota: route.codigo_rota,
        ponto_embarque: origemVolta.nome,
        distancia_km: route.distancia_km,
        tempo_estimado: route.tempo_viagem_estimado_minutos,
        motorista: 'LOREM IPSUM',
        capacidade: veiculo.capacidade || '',
    };
    return [ida, volta];
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusCard } from '../../domain';
import { routesData, formatRouteForBusCard, getPassengerRoute } from './routeData';
import ActionButton from '../../common/buttons/ActionButton';
import { useRoutes } from '../../../hooks/data/useRoutes';

// Dados formatados para o BusCard baseados na estrutura do banco
const fakeRoutes = routesData.map(routeData => formatRouteForBusCard(routeData));

// Handler para clique nos cartões de ônibus
const handleBusClick = (route) => {
    console.log('Bus clicked:', route);
    // TODO: Implementar navegação para detalhes do ônibus
};


// Componente BottomSheet na versão Mini - mostra apenas próximos ônibus
const BottomSheetMini = () => {
    return (
        <div className="mt-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0 fw-bold text-dark">Próximos Ônibus</h6>
                <small className="text-muted">
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Agora
                </small>
            </div>

            {fakeRoutes.map(route => (
                <BusCard
                    key={route.id}
                    route={route}
                    onClick={handleBusClick}
                />
            ))}
        </div>
    );
};

// Componente BottomSheet na versão Média - inclui debug e sugestões
const BottomSheetMedium = () => {
    const navigate = useNavigate();
    const { routes } = useRoutes();
    const { vehicles } = useVehicles();
    // Transforma os dados da API para o formato do BusCard (ida e volta)
    const busCardRoutes = routes ? transformRouteApiToBusCard(routes, vehicles) : [];
    console.log('routes:', routes);
    console.log('busCardRoutes:', busCardRoutes);
    return (
        <div className="overflow-y-auto overflow-x-hidden">
            {/* Seção de Sugestões */}
            <div className="mt-3 bg-light text-dark">
                <div className="mb-3">
                    <h5 className="mb-2 fw-bold text-dark">Sugestões</h5>
                    <p className="mb-3 text-dark-emphasis small">
                        Seu ônibus escolar sai da A. Zeus às 5h45.
                    </p>
                </div>
                <div className="d-flex flex-column">
                    {busCardRoutes.map(route => (
                        <BusCard
                            key={route.id}
                            route={route}
                            onClick={handleBusClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente BottomSheetFull
const BottomSheetFull = () => {
    const navigate = useNavigate();

    return (
        <div className="overflow-y-auto overflow-x-hidden">
            {/* Botões de Debug */}
            <div className="p-3 border-bottom">
                <h6 className="mb-3 text-muted">Debug</h6>
                
                <div className="d-grid gap-2">
                    <ActionButton
                        icon="bi-box-arrow-in-right"
                        variant="outline-primary"
                        onClick={() => navigate('/login')}
                    >
                        Ir para Login
                    </ActionButton>
                    
                    <ActionButton
                        icon="bi-person-plus"
                        variant="outline-success"
                        onClick={() => navigate('/register')}
                    >
                        Ir para Register
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};


const BottomSheetContent = ({ anchor }) => {
    // Mapeamento dos tipos de anchor para componentes
    const contentMap = {
        0: BottomSheetMini,
        1: BottomSheetMedium,
        2: BottomSheetFull
    };
    
    const Content = contentMap[anchor] || BottomSheetMini;

    return (
        <Content anchor={anchor} />
    );
};

export default BottomSheetContent;