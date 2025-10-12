// Webapp Hooks - Organized Structure

// Authentication hooks
export { useLogin } from './auth/useLogin';
export { useRegister } from './auth/useRegister';
export { useEditProfile } from './auth/useEditProfile';
export { useAuthEvents } from './useAuthEvents';

// Data hooks
export * from './data/useRoutes';
export * from './data/useVehicles';
export * from './data/useVehiclesWithDrivers';
export * from './data/useStops';

// Map and routing hooks
export * from './map';

// UI related hooks
export * from './ui';

// Feature-specific hooks
export * from './features';
export { default as useInputIconAnimation } from './useInputIconAnimation';
