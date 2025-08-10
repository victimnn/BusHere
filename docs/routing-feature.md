# Rotas Reais vs Linhas Retas

Este documento explica a nova funcionalidade de roteamento que permite escolher entre rotas reais (seguindo ruas e avenidas) e linhas retas diretas entre pontos, incluindo um sistema de cache inteligente.

## Funcionalidades

### 1. Controle de Roteamento
- **Toggle "Usar rotas reais"**: Permite alternar entre rotas reais e linhas retas
- **Indicador de carregamento**: Mostra quando as rotas estão sendo calculadas
- **Localização**: Disponível tanto no painel de controle quanto como elemento flutuante no mapa
- **Estatísticas do cache**: Botão para visualizar performance do cache

### 2. Sistema de Cache Inteligente

#### Características do Cache
- **Cache de Segmentos**: Armazena rotas individuais entre dois pontos
- **Cache de Sequências**: Armazena rotas completas com múltiplos pontos
- **TTL (Time To Live)**: 1 hora para segmentos, 2 horas para sequências
- **LRU (Least Recently Used)**: Remove automaticamente entradas antigas
- **Persistência**: Salva automaticamente no localStorage

#### Benefícios
- **Redução de API calls**: Evita requisições redundantes
- **Carregamento instantâneo**: Rotas já calculadas aparecem imediatamente
- **Economia de dados**: Reduz consumo de banda
- **Melhor UX**: Interface mais responsiva

#### Gerenciamento
- **Limpeza automática**: Remove entradas expiradas periodicamente
- **Backup automático**: Salva no localStorage a cada 5 minutos
- **Estatísticas detalhadas**: Modal com informações completas do cache
- **Controle manual**: Botões para limpar ou salvar cache

### 3. Serviços de Roteamento

#### OSRM (Open Source Routing Machine) - Padrão
- **URL**: `https://router.project-osrm.org/`
- **Gratuito**: Sem necessidade de API key
- **Limitações**: Rate limiting (recomenda-se pausas entre requisições)
- **Qualidade**: Boa para uso geral

#### OpenRouteService - Alternativo
- **URL**: `https://api.openrouteservice.org/`
- **API Key**: Necessária para uso em produção
- **Limitações**: 2000 requisições por dia no plano gratuito
- **Qualidade**: Excelente, com mais opções de configuração

### 4. Comportamento

#### Rotas Reais Ativadas
- As linhas seguem as ruas e avenidas reais
- Calculo em tempo real usando APIs externas
- Indicador visual de carregamento (linha tracejada amarela)
- Fallback para linha reta em caso de erro na API

#### Rotas Reais Desativadas
- Linhas retas diretas entre pontos
- Cálculo instantâneo
- Menor precisão para estimativas de tempo/distância real

## Implementação Técnica

### Hook `useRouting` com Cache
```javascript
const { 
    calculateRealRoute, 
    combineRouteSegments, 
    loading, 
    error,
    cacheStats 
} = useRouting();

// Estatísticas disponíveis
console.log(`Cache hits: ${cacheStats.hits}`);
console.log(`API calls: ${cacheStats.apiCalls}`);
console.log(`Hit rate: ${cacheStats.hitRate}%`);
```

### Hook `useRouteCache`
```javascript
import { routeCache, sequenceCache, useCacheManager } from './useRouteCache';

const { clearCache, getStats, saveToLocalStorage, loadFromLocalStorage } = useCacheManager();

// Exemplo de uso
const stats = getStats();
console.log('Cache de segmentos:', stats.segmentCache);
console.log('Cache de sequências:', stats.sequenceCache);
```

### Componente `CacheStats`
```jsx
import { CacheStats } from '@web/components/ui/CacheStats';

<CacheStats
    cacheStats={cacheStats}
    show={showModal}
    onClose={() => setShowModal(false)}
/>
```

### Hook `useMapMarkers` atualizado
```javascript
const { 
    markers, 
    polylines, 
    routingLoading 
} = useMapMarkers(stops, pontosSelecionados, handlers, useRealRoutes);
```

### Componente `RouteControls` com Cache
```jsx
<RouteControls
    useRealRoutes={useRealRoutes}
    onToggleRealRoutes={setUseRealRoutes}
    routingLoading={routingLoading}
    cacheStats={cacheStats}
    size="compact" // ou "normal"
/>
```

## Configuração de Produção

### Para OpenRouteService com API Key
1. Registre-se em [openrouteservice.org](https://openrouteservice.org/)
2. Obtenha sua API key
3. Adicione no arquivo `useRouting.js`:
```javascript
headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
}
```

### Variáveis de Ambiente (Recomendado)
```javascript
// .env
VITE_OPENROUTE_API_KEY=sua_api_key_aqui

// useRouting.js
'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTE_API_KEY}`
```

## Rate Limiting e Performance com Cache

### Estratégias Implementadas
1. **Cache de múltiplas camadas**: Segmentos e sequências separados
2. **Delay entre requisições**: 100ms para evitar rate limiting (só para novas requisições)
3. **Fallback automático**: Linha reta se a API falhar
4. **Cache local**: As rotas são recalculadas apenas quando os pontos mudam
5. **Cancelamento de requisições**: Evita conflitos ao alterar pontos rapidamente
6. **Persistência**: Backup automático no localStorage

### Configurações do Cache
```javascript
// Cache de segmentos: 150 entradas, TTL 1 hora
export const routeCache = new RouteCache(150, 60);

// Cache de sequências: 50 entradas, TTL 2 horas  
export const sequenceCache = new RouteCache(50, 120);
```

### Otimizações
- **Chaves de cache consistentes**: Coordenadas arredondadas para 6 casas decimais
- **Limpeza automática**: Remove 20% das entradas mais antigas quando necessário
- **Validação de TTL**: Verifica expiração antes de retornar dados
- **Compressão implícita**: Armazena apenas coordenadas essenciais

### Recomendações
- Use OSRM para desenvolvimento (sem API key necessária)
- Configure OpenRouteService para produção com maior limite
- Considere implementar cache do lado servidor para rotas frequentes
- Monitore o uso da API para evitar exceder limites

## Troubleshooting

### Problemas Comuns
1. **Rotas não aparecem**: Verifique conectividade com APIs externas
2. **Linha reta mesmo com toggle ativado**: Possível rate limiting ou erro na API (verificar estatísticas do cache)
3. **Carregamento infinito**: Timeout nas APIs, será feito fallback automaticamente
4. **Cache crescendo muito**: Sistema de limpeza automática ativará

### Debug e Monitoramento
```javascript
// Console logs estão implementados para monitoramento
console.warn('Erro ao buscar rota real:', error);
console.log('Cache hit para rota:', cacheKey);
console.log('API call para rota:', cacheKey);

// Verificar estatísticas do cache
const stats = getStats();
console.log('Cache stats:', stats);
```

### Comandos Úteis
```javascript
// Limpar todo o cache
clearCache();

// Salvar cache manualmente
saveToLocalStorage();

// Carregar cache do localStorage
loadFromLocalStorage();

// Ver estatísticas detalhadas
const stats = getStats();
```

## Futuras Melhorias

1. **Cache inteligente avançado**: ✅ **Implementado** - Sistema completo com TTL e LRU
2. **Múltiplos provedores**: Alternar automaticamente entre APIs se uma falhar
3. **Configurações avançadas**: Tipo de veículo, evitar pedágios, etc.
4. **Otimização de rota**: Algoritmo para melhor sequência de pontos
5. **Roteamento offline**: Usando bibliotecas como Leaflet Routing Machine
6. **Pré-aquecimento de cache**: Calcular rotas comuns antecipadamente
7. **Cache compartilhado**: Sincronizar cache entre usuários para rotas populares
8. **Métricas avançadas**: Dashboard de performance e uso de API
