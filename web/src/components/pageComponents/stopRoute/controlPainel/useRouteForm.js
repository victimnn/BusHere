import { useState, useEffect } from 'react';
import api from '@web/api/api';

export function useRouteForm(stats, initialData = null) {
    const [formData, setFormData] = useState({
        nome: '',
        codigo_rota: '',
        origem_descricao: '',
        destino_descricao: '',
        distancia_km: 0,
        tempo_viagem_estimado_minutos: 0,
        status_rota_id: 1,
        onibus_id: null,
        motorista_id: null,
        observacoes_assignment: ''
    });
    
    const [statusOptions, setStatusOptions] = useState([
        { status_rota_id: 1, nome: 'Ativa', descricao: 'Rota ativa e em funcionamento' },
        { status_rota_id: 2, nome: 'Inativa', descricao: 'Rota temporariamente inativa' },
        { status_rota_id: 3, nome: 'Em Planejamento', descricao: 'Rota em fase de planejamento' }
    ]);

    // Carregar dados iniciais se fornecidos (modo de edição)
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                nome: initialData.nome || '',
                codigo_rota: initialData.codigo_rota || '',
                origem_descricao: initialData.origem_descricao || '',
                destino_descricao: initialData.destino_descricao || '',
                distancia_km: initialData.distancia_km || 0,
                tempo_viagem_estimado_minutos: initialData.tempo_viagem_estimado_minutos || 0,
                status_rota_id: initialData.status_rota_id || 1,
                onibus_id: initialData.onibus_id || null,
                motorista_id: initialData.motorista_id || null,
                observacoes_assignment: initialData.observacoes_assignment || ''
            }));
        }
    }, [initialData]);

    // Atualizar distância e tempo quando pontos mudarem
    useEffect(() => {
        if (stats.totalDistance > 0) {
            setFormData(prev => ({
                ...prev,
                distancia_km: parseFloat(stats.totalDistance.toFixed(2)),
                tempo_viagem_estimado_minutos: Math.round(stats.estimatedTime)
            }));
        }
    }, [stats.totalDistance, stats.estimatedTime]);

    // Carregar opções de status da API
    useEffect(() => {
        const loadStatusOptions = async () => {
            try {
                const response = await api.routes.getStatus();
                if (response && Array.isArray(response)) {
                    setStatusOptions(response);
                }
            } catch (error) {
                console.warn('Erro ao carregar status das rotas:', error);
            }
        };

        loadStatusOptions();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            { field: 'nome', message: 'Nome da rota é obrigatório' },
            { field: 'codigo_rota', message: 'Código da rota é obrigatório' },
            { field: 'origem_descricao', message: 'Descrição da origem é obrigatória' },
            { field: 'destino_descricao', message: 'Descrição do destino é obrigatória' }
        ];

        for (const { field, message } of requiredFields) {
            if (!formData[field].trim()) {
                alert(message);
                return false;
            }
        }

        return true;
    };

    return {
        formData,
        statusOptions,
        handleInputChange,
        validateForm
    };
}
