
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakOnLoad } from 'keycloak-js';
import { RolesInterceptor } from './services/interceptors/roles.interceptor';
import { UserService } from './services/user.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

export function kcFactory(keycloakService: KeycloakService) {
  return environment.keycloak.enabled
    ? () => keycloakService.init({
      config: {
        url: environment.keycloak.config.url,
        realm: environment.keycloak.config.realm,
        clientId: environment.keycloak.config.clientId
      },
      initOptions: {
        onLoad: environment.keycloak.onLoad as KeycloakOnLoad,
        checkLoginIframe: false
      },
      bearerPrefix: "Bearer",

      enableBearerInterceptor: true,
      loadUserProfileAtStartUp: true,
      // bearerExcludedUrls: ['/assets', '/clients/public']
    })
    : () => Promise.resolve(true);
}

export function rolesFactory(userService: UserService) {
  return !environment.keycloak.enabled
    ? () => new RolesInterceptor(userService)
    : () => Promise.resolve(true);
}


