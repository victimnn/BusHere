// Webapp Hooks - Organized Structure

// Authentication hooks
export { useLogin } from './auth/useLogin';
export { useRegister } from './auth/useRegister';
export { useAuthEvents } from './useAuthEvents';

// UI related hooks
export * from './ui';

// Feature-specific hooks
export * from './features';