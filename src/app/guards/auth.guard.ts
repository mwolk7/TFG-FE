import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const requiredRoles: string[] = route.data.requiredRoles;
    console.log(`calling auth guard on route [${state.url}] required roles [${requiredRoles}]`);

    return this.userService.isLogged()
      .then(logged => {
        if (!logged) {
          this.router.navigate(['/']);
          return false;
        }

        if (!requiredRoles || requiredRoles.length < 1) {
          console.log("route ok");
          return true;
        }

        if (this.userService.checkRoles(requiredRoles)) {
          console.log("route ok 2");
          return true;
        }

        this.router.navigate(['/']);
        return false;
      })
      .catch(err => {
        console.log(`failed calling user service, user not enabled [${err}]`);
        return false;
      });
  }
}
