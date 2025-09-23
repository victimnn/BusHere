
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusCard } from '../../domain';
import { routesData, formatRouteForBusCard, getPassengerRoute } from './routeData';
import ActionButton from '../../common/buttons/ActionButton';

// Dados formatados para o BusCard baseados na estrutura do banco
const routes = routesData.map(routeData => formatRouteForBusCard(routeData));

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

            {routes.map(route => (
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
                    {routes.map(route => (
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




