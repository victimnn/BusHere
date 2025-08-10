// Hooks relacionados a dados (Data Layer)
export { useBuses } from './data/useBuses';
export { useDrivers } from './data/useDrivers';
export { usePassengers } from './data/usePassengers';
export { useRoutes } from './data/useRoutes';
export { useStops } from './data/useStops';
export { useRouteWithStops } from './data/useRouteWithStops';

// Hooks para operações específicas (Business Logic)
export { useDetailPage } from './operations/useDetailPage';
export { 
  useApiOperation,
  getRouteErrorMessage,
  transformRouteData,
  prepareRouteBackendData,
  useRouteStatus,
  useCoordinateUtils
} from './operations/useRouteOperations';
export { 
  useBusOptions, 
  useDriverOptions, 
  useFormattedBusOptions, 
  useFormattedDriverOptions 
} from './operations/useFormOptions';

// Hooks relacionados ao dashboard (Analytics & Reports)
export { useDashboardData } from './dashboard/useDashboardData';
export { useReportData } from './dashboard/useReportData';
export { useChartData } from './dashboard/useChartData';
export { useRecentActivities } from './dashboard/useRecentActivities';

// Hooks relacionados a mapas e rotas (Map & Routing)
export { useMapMarkers } from './map/useMapMarkers';
export { useRouting } from './map/useRouting';
export { useAdvancedRouteStats } from './map/useAdvancedRouteStats';
export { 
  useCacheManager, 
  routeCache, 
  sequenceCache 
} from './map/useRouteCache';

// Hooks de interface e utilidades (UI & Utils)
export { useNotification } from './ui/useNotification';
