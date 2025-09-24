import { Role, type UserRole } from '../../types';

/**
 * Dekoduje JWT token i wyciąga z niego role użytkownika
 * @param token JWT token
 * @returns Tablica ról użytkownika
 */
export function decodeJwtRoles(token: string): UserRole[] {
  try {
    // JWT składa się z trzech części oddzielonych kropkami: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Dekoduj payload (druga część)
    const payload = parts[1];
    
    // Dodaj padding jeśli potrzeba (base64url może nie mieć padding)
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Dekoduj z base64url
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const payloadObj = JSON.parse(decodedPayload);

    // Wyciągnij role z payload
    const roles = payloadObj.roles as string[];
    if (!Array.isArray(roles)) {
      return [];
    }

    // Mapuj stringi na enum Role
    return roles
      .map(role => {
        switch (role) {
          case 'MIESZKANIEC':
            return Role.MIESZKANIEC;
          case 'ZARZAD':
            return Role.ZARZAD;
          case 'ADMINISTRATOR':
            return Role.ADMINISTRATOR;
          default:
            return null;
        }
      })
      .filter((role): role is UserRole => role !== null);
  } catch (error) {
    console.error('Error decoding JWT roles:', error);
    return [];
  }
}

/**
 * Dekoduje JWT token i wyciąga z niego nazwę użytkownika
 * @param token JWT token
 * @returns Nazwa użytkownika lub null
 */
export function decodeJwtUsername(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const payload = parts[1];
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const payloadObj = JSON.parse(decodedPayload);

    return payloadObj.sub || payloadObj.username || null;
  } catch (error) {
    console.error('Error decoding JWT username:', error);
    return null;
  }
}
