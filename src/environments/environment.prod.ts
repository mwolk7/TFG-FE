import { RoleBuilder } from 'src/app/commons/roles/roles';

export const environment = {
  production: true,
  apiUrl: window['apiUrl'],
  keycloak: {
    enabled: true,
    config: {
      url: window['keycloakUrl'],
      realm: 'not-bug',
      clientId: 'fe-not-bug'
    },
    onLoad: 'login-required'
  },
  mock: {
    username: 'Piero',
    roles: RoleBuilder.all
  }
};
