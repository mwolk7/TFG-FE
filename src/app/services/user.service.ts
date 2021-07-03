import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

function checkRoles(rolesToCheck: string[], rolesOwned: string[]): boolean {
  for (const entry of rolesToCheck) {
    if (rolesOwned.includes(entry)) {
        return true;
    }
  }
  return false;
}

export class User {
    constructor(
        public id: string,
        public email: string,
        public name: string,
        public surname: string,
        public roles: string[]
    ) {
    }
}

@Injectable({
  providedIn: 'root'
})
export class MockUserService implements UserService {
  constructor(private router: Router) { }

  private readonly currentUser: User = new User(environment.mock.username, 'test.user@user.test', 'test', 'user', environment.mock.roles);

  logout(): boolean {
    this.router.navigate(['/']);
    return true;
  }

  isLogged(): Promise<boolean> {
      return Promise.resolve(true);
  }

  getLoggedUser(): User {
      return this.currentUser;
  }

  checkRoles(rolesToCheck: string[]): boolean {
    return checkRoles(rolesToCheck, this.currentUser.roles);
  }
}

// TODO: non-final implementation, to fix
// TODO: all sentitive data should not be taken from token, but from a profile api
//       at maximum, roles can be taken from JWT token (to be verified)
@Injectable({
  providedIn: 'root'
})
export class KeycloakUserService implements UserService {
  constructor(private kcService: KeycloakService,
              private router: Router) { }

  private readonly emptyUser: User = new User('<UNKNOWN>', 'unknown@unknown', 'UNKNOWN', 'UNKNOWN', []);

  logout(): boolean {
    this.router.navigate(['/'], { replaceUrl: true }).then(()=>{
      this.kcService.logout();
    });
    return true;
  }

  isLogged(): Promise<boolean> {
    return this.kcService.isLoggedIn();
  }

  getLoggedUser(): User {
    // todo add name and surname
    return new User(this.kcService.getUsername(), this.kcService.getUsername(), this.kcService.getUsername(), '', this.kcService.getUserRoles());
  }

  checkRoles(rolesToCheck: string[]): boolean {
    return checkRoles(rolesToCheck, this.kcService.getUserRoles());
  }
}

export abstract class UserService {
  abstract logout(): boolean;
  abstract isLogged(): Promise<boolean>;
  abstract getLoggedUser(): User;
  abstract checkRoles(rolesToCheck: string[]): boolean;
}
