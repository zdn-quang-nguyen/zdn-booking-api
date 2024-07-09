export const keycloakConfig = {
  authServerUrl: process.env.KEYCLOAK_HOST,
  realm: process.env.KEYCLOAK_REALMS,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  secret: process.env.KEYCLOAK_CLIENT_SECRET,
};
